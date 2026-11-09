# Aprendizaje — Por qué construimos Kubernetes así (Fase 2, 2026-11-06)

> Documento educativo complementario a `docs/sessions/2026-11-06-cicd-fase-2-kubernetes.md`.
> Conceptos: declarative vs imperative, Kustomize, el problema de las migraciones en producción, StatefulSet, readiness como mecanismo de orden, y el gateway como decisión arquitectónica.

---

## 1. De docker-compose a Kubernetes: qué cambia conceptualmente

Docker-compose orquesta contenedores **en una sola máquina** y se usa de forma mayormente *imperativa* (`up`, `down`, `restart`). Kubernetes orquesta contenedores **en un clúster** y su modelo es *declarativo*: tú describes el estado deseado ("quiero 1 réplica de auth-service con esta imagen y estas env vars") y el sistema trabaja continuamente para que la realidad coincida. Por eso todo son manifiestos YAML y no comandos: el YAML es la fuente de verdad, reaplicable, versionable y auditable.

Esto explica decisiones que en compose no existían:

- **Probes**: en compose, "¿está listo?" lo decide quien mira logs. En K8s es declarativo: `/health/ready` y `/health/live` le dicen al planificador cuándo enviar tráfico y cuándo reiniciar. La plataforma ya los exponía (Epic-006); los manifiestos solo los consumen.
- **Recursos requests/limits**: en un clúster compartido, el scheduler necesita saber cuánto pide cada pod para colocarlo. Sin requests, tu pod puede no caber nunca o asfixiar a los demás.
- **runAsNonRoot**: el clúster no confía en la imagen por defecto; la política se declara por pod (y la imagen ya corría como `$APP_UID` desde el Bloque 1 — las dos cosas se alinean).

## 2. Kustomize: herencia sin templates

Helm parametriza con **templates + valores** (programación dentro del YAML). Kustomize hace **composición**: `base/` define los recursos completos; cada *overlay* aplica transformaciones puntuales (namespace, labels, tags de imagen) por encima. No hay lenguaje de plantillas que aprender ni valores invisibles: lo que renderiza `kubectl kustomize overlays/staging` es exactamente lo que se aplica, y se puede inspeccionar (`| grep`, `| less`) antes de tocar nada.

Por eso las imágenes llevan un placeholder (`ghcr.io/example/...`) que los overlays sustituyen con `images:` — y por eso production **no** fija tag: el CD lo fijará con `kustomize edit set image ...:<sha>`, manteniendo la regla de oro de la Fase 1 (nada de `:latest` en prod).

Detalle real de la sesión: kustomize v5.8 deprecó `commonLabels` en favor de `labels:` + `includeSelectors`. Los warnings de herramientas son gratis — hay que leerlos: corregir ahora evita que una versión futura rompa el build.

## 3. El problema de las migraciones en producción

Es el problema clásico que `architecture.md` §9 dejó abierto: en Development las migraciones EF corren automáticas al arrancar; en producción eso es peligroso (múltiples réplicas corriendo migraciones concurrentes, rollbacks imposibles, credenciales con DDL en runtime). Las opciones:

| Estrategia | Problema |
|---|---|
| Auto-migrar en el API (Development) | Carreras entre réplicas; DDL con las credenciales de la app |
| `dotnet ef database update` manual | Requiere SDK + fuentes en el servidor; paso manual olvidable |
| initContainer por Deployment | Se duplica por réplica/Deployment; orden no garantizado |
| **Migrations bundle + Job** ✅ | Ejecutable autocontenido en la imagen; corre una vez, controlado |

El **migrations bundle** (`dotnet ef migrations bundle`) compila las migraciones en un ejecutable autocontenido que se copia junto al publish (`COPY --from=migrations /app/migrate .`). El Job de Kubernetes lo corre **una sola vez** (`restartPolicy: Never`, `backoffLimit: 3`) antes de que la API sirva tráfico. La imagen de runtime no necesita SDK, y el DDL no vive en el proceso de la API.

**Lección**: "cómo migro la base" no es un detalle de ops, es una decisión de arquitectura que toca imágenes, manifiestos y orden de arranque. Dejarla "para después" es cómo se llega a producciones que no pueden redeployar sin miedo.

## 4. El truco de los readiness probes: orden sin orquestación

`kubectl apply -k` no garantiza orden de creación. En vez de inventar orquestación (Helm hooks, initContainers encadenados, operadores), los manifiestos aprovechan la propiedad que ya existía en la plataforma:

1. Los Jobs de migración arrancan y aplican el esquema (o no — Postgres tarda en arrancar, el Job reintenta).
2. Los pods de los servicios arrancan **antes** de que el esquema exista y fallan su readiness (`/health/ready` incluye chequeo Npgsql).
3. Kubernetes no envía tráfico a pods no-ready y los reinicia; en cuanto el esquema existe, el próximo chequeo pasa y el Deployment queda `1/1 Ready`.

Es **self-healing declarativo**: no se programa el orden, se declaran las condiciones de salud y el sistema compone el orden solo. Este es el patrón mental más importante de Kubernetes y la razón de que los health checks reales (Epic-006) fueran un prerrequisito, no un adorno.

## 5. StatefulSet para Postgres: estado en un sistema diseñado para lo stateless

Los Deployments son para procesos **efímeros e intercambiables**: si un pod muere, otro idéntico lo reemplaza y nadie lo nota. Postgres no es así: sus datos viven en disco y su identidad importa. El **StatefulSet** da justo eso:

- Nombre de red estable (`postgres`, resoluble por DNS dentro del clúster — los connection strings del Secret usan `Host=postgres` en vez de una IP).
- `volumeClaimTemplates`: un PVC **por réplica**, creado una vez y reattached si el pod se reubica (los datos sobreviven al pod).
- Arranco ordenado y a lo sumo uno (para cuando haya réplicas).

La decisión consciente documentada: esto es para **aprendizaje**. En producción real, una base gestionada (RDS/Cloud SQL) elimina todo este archivo y los manifistos de la app no cambian — el Service `postgres` apuntaría fuera. Esa sustituibilidad es la prueba de que el acoplamiento está bien hecho.

## 6. El gateway: una decisión que desbloquea otras tres

Antes, el navegador hablaba con 5 puertos distintos (`VITE_*_API_URL` por servicio). Eso bloqueaba: TLS (¿5 certificados?), CORS, y la imagen de frontend (URLs quemadas en build imposibles de parametrizar por entorno sin un punto de entrada único).

El ingress resuelve todo de una vez:

```
recruitment.local/api/jobs  ──► job-service:80
recruitment.local/api/auth  ──► auth-service:80
recruitment.local/          ──► frontend:80   (catch-all, SPA)
```

Consecuencias en cadena:

1. **Las 5 `VITE_*_API_URL` pueden ser la misma URL** (`http://recruitment.local/api`) → una sola build-arg por entorno, no cinco.
2. **Mismo origen** → CORS deja de ser un problema (el valor sigue configurado, por si el frontend se sirve aparte).
3. **Un punto para TLS/HSTS** cuando llegue (hoy el certificado no existe; el placeholder está documentado).

**Lección**: las decisiones de infraestructura no se evalúan solo por lo que resuelven, sino por cuántas deudas anteriores cancelan. Un ingress de 40 líneas eliminó tres capítulos del documento de arquitectura.

## 7. Seguridad: el Secret que no está en el repo

Los manifiestos referencian `recruitment-secrets` pero **no lo definen** — existe solo `recruitment-secrets.example.yaml` con valores de mentira y un README que explica el `kubectl create secret`. Esto es el patrón `.env`/`.env.example` de la Fase 1 llevado a Kubernetes: la forma del secreto se versiona (contrato), el valor nunca (ataque).

La verificación que falta es el principio fail-fast del Bloque 1 en acción: si el Secret no existe o `JWT_KEY` tiene menos de 32 caracteres, los pods **fallan en el arranque** (`ValidateOnStart`), no aceptan tráfico mal configurado. En Kubernetes eso se ve como `CrashLoopBackOff` con el motivo en los logs — feo de ver, correcto de comportar.

## 8. Resumen de conceptos

| Concepto | Dónde se vio |
|---|---|
| Declarativo vs imperativo | Manifiestos vs `docker compose up` |
| Kustomize: composición sin templates | base/ + overlays, `images:` override |
| Migraciones como decisión de arquitectura | Migrations bundle en Dockerfile + Job por servicio |
| Orden sin orquestación | Readiness probes + self-healing |
| StatefulSet para estado | Postgres: identidad estable, PVC por réplica |
| Gateway como multiplicador | Ingress: CORS, TLS-ready, frontend parametrizable |
| Fail-fast en el clúster | Secret faltante → CrashLoopBackOff con causa clara |
| Warnings de herramientas | `commonLabels` deprecado → `labels:`/`includeSelectors` |

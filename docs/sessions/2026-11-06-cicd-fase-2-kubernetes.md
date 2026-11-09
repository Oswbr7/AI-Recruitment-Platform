# Sesión 2026-11-06 — CI/CD Fase 2: manifiestos Kubernetes (Kustomize) + estrategia de migraciones + gateway

> **Tipo**: Infraestructura Kubernetes (nuevo `Infraestructure/kubernetes/`)
> **Alcance**: Plan Fase 2 ítems 1-4 completos (manifiestos base + overlays, Secret JWT, migraciones, gateway) + Postgres en StatefulSet (ítem 5, para que el stack sea aplicable en kind) + Dockerfiles con migrations bundle. Item 6 (cluster kind funcionando) **pendiente de Docker Desktop**.
> **Estado al cierre**: ✅ `kubectl kustomize` renderiza ambos overlays sin errores (26 objetos), YAML validado. ⚠️ Validación contra API server real y runtime queda para el primer `kind create cluster` (Docker Desktop detenido en esta máquina).

---

## 1. Contexto y problema

El plan acordado (Fases 0-3) dejaba la Fase 2 como prerequisito del despliegue: no había carpeta `kubernetes/`, las migraciones solo corrían automáticas en Development (explícitamente desactivadas en Production por diseño), el secreto JWT compartido no tenía estrategia de distribución y el navegador hablaba con cada microservicio por su puerto (sin gateway). Esta sesión cierra los 4 primeros ítems y deja el stack aplicable de punta a punta en kind.

## 2. Decisiones tomadas (y por qué)

| Decisión | Alternativa rechazada | Razón |
|---|---|---|
| **Kustomize** (base + overlays staging/production) | Helm | Menos conceptos nuevos (sin templates/values), overlays explícitos, `kubectl apply -k` nativo. Helm es evolución natural documentada |
| **Migraciones: EF migrations bundle** en la imagen + Job por servicio | initContainer / Job con SDK / migración manual / auto-migrar en Production | El bundle es ejecutable autocontenido en la imagen runtime (sin SDK en el clúster), es el enfoque recomendado por EF para producción, y preserva la decisión de NO auto-migrar en Production (§9 architecture.md) |
| **Gateway: nginx Ingress path-based** (`recruitment.local`) | Un puerto/Service por servicio expuesto | Un solo origen → CORS innecesario, una sola entrada, y desbloquea la imagen de frontend (las `VITE_*` apuntan a `/api` del gateway) |
| **Postgres en StatefulSet dentro del clúster** | Base gestionada | Es un cluster de aprendizaje (kind); la decisión y su límite quedan documentados en el README |
| **Secrets manuales** (`kubectl create secret`, documentado en `secrets/README.md`) | Sealed Secrets / External Secrets | Sin infra extra en kind; producción real documentada como evolución |
| **`:latest` solo en staging**; production sin tag fijo | `:latest` en ambos | Coherencia con la Fase 1: prod fija tag SHA desde el CD (`kustomize edit set image`), documentado en el overlay |

## 3. Cambios realizados

### 3.1 Dockerfiles de los 5 servicios — stage `migrations`

```dockerfile
FROM build AS migrations
RUN dotnet tool restore && \
    dotnet ef migrations bundle \
        --project services/<svc>/src/<Svc>.Infrastructure/<Svc>.Infrastructure.csproj \
        --startup-project services/<svc>/src/<Svc>.Api/<Svc>.Api.csproj \
        -r linux-x64 --self-contained -o /app/migrate
# runtime:
COPY --from=migrations /app/migrate .
```

- Usa `dotnet-tools.json` del repo root (dotnet-ef 10.0.9 ya declarado).
- `-r linux-x64 --self-contained`: el ejecutable corre en la imagen `aspnet:10.0` sin SDK.
- `dotnet tool restore` dentro del stage (el manifest viaja con `COPY . .`).

### 3.2 `Infraestructure/kubernetes/` (nuevo, 15 archivos)

```
kubernetes/
├── README.md                  # walkthrough kind completo + decisiones/límites
├── kind-config.yaml           # 1 nodo, mapeo 80/443 para ingress
├── base/
│   ├── kustomization.yaml     # (labels includeSelectors — sintaxis nueva, no commonLabels)
│   ├── postgres/              # StatefulSet (PVC 1Gi, probe pg_isready) + Service + ConfigMap init-db
│   ├── {5 servicios}.yaml     # Deployment (env→Secret, probes /health/ready|live, resources) + Service (80→8080) + Job migración
│   ├── frontend.yaml          # Deployment + Service
│   └── ingress.yaml           # /api/auth|users→auth, /api/jobs→job, ... catch-all→frontend
├── overlays/{staging,production}/kustomization.yaml   # namespace + images (staging: latest; prod: sin tag → CD fija SHA)
└── secrets/                   # README (comando kubectl create secret) + example yaml (valores de mentira, documentado como no-aplicable)
```

Detalles de diseño en los manifiestos:
- Los 4 servicios generados desde `auth-service.yaml` vía `sed` (mismo esqueleto, distinto nombre/DB key) — consistencia mecánica garantizada.
- **Probes**: readiness `/health/ready` (incluye chequeo Npgsql — es lo que hace que los pods esperen al esquema), liveness `/health/live`.
- **Orden de arranque**: `apply -k` no ordena; los pods de servicios crash-loop-recuperan hasta que el Job de migraciones aplica el esquema (patrón documentado, con verificación y caveat de inmutabilidad de Jobs en el README).
- **Seguridad**: `runAsNonRoot: true` en todos los pods (la imagen ya corre como `$APP_UID`), secretos solo por `secretKeyRef`, nunca en el repo.
- Los manifiestos de servicio repiten el bloque de env (JWT, CORS, connection string) — candidato a factorizar con un componente/configMapGenerator en una evolución (documentado).

## 4. Verificación

| Verificación | Resultado |
|---|---|
| YAML parsea (js-yaml, 26 documentos en 15 archivos) | ✅ |
| `kubectl kustomize overlays/staging` y `overlays/production` | ✅ (kustomize v5.8.1 embebido en kubectl v1.36) |
| Render resultante | ✅ 6 Deployments, 7 Services, 5 Jobs, 1 StatefulSet, 1 ConfigMap, 1 Ingress por overlay; namespaces `recruitment-staging` / `recruitment` inyectados |
| Deprecación `commonLabels` | ✅ Detectada por el propio kustomize y corregida a `labels:`/`includeSelectors` |
| `kubectl apply --dry-run` | ⚠️ No ejecutable sin API server (descubre esquemas del cluster) — queda para kind |
| Build de imágenes con stage `migrations` | ⚠️ Docker daemon detenido — el job `docker-validation` del CI lo verificará en el push |

## 5. Descubrimientos para la siguiente sesión

1. **Primer smoke test en kind** (requiere Docker Desktop): seguir `kubernetes/README.md` paso a paso — especialmente verificar que el bundle `/app/migrate` corre contra Postgres del clúster y que los Deployments se recuperan tras el Job.
2. **`kubectl` v1.36 está instalado localmente** — la sesión de kind no necesita instalar nada más que kind + Docker.
3. **Inmutabilidad de los Jobs de migración**: el flujo documentado (delete + apply) es mecánico; una evolución elegante es mover los Jobs a un componente aparte o usar `kubectl create job --from`, o directamente Helm/Argo CD.
4. **Env repetido en los 5 manifiestos de servicio**: un `Component` de Kustomize con el bloque JWT/CORS reduciría ~40 líneas duplicadas por archivo.
5. **HSTS sigue omitido** (§8 architecture.md): con el ingress ya tiene sentido activarlo a nivel nginx cuando haya TLS.

## 6. Qué NO se hizo (y por qué)

- **No se creó el cluster kind ni se aplicó nada** — Docker Desktop detenido; el README tiene el walkthrough completo listo para ejecutar.
- **No se escribió `deploy.yml` (Fase 3)** — requiere el cluster funcionando + kubeconfig en secrets + validar el flujo de migraciones en kind primero.
- **No se factorizó el env repetido** ni se crearon PDBs/anti-affinity — deuda de manifiestos registrada, deliberadamente postergada para no mezclar refactors con el primer arranque real.
- **No se versionó ningún secreto real** — el example lleva valores de mentira y el README lo advierte explícitamente.

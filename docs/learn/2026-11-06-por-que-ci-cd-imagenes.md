# Aprendizaje — Por qué construimos el CI/CD así (Fases 0 y 1, 2026-11-06)

> Documento educativo complementario a `docs/sessions/2026-11-06-cicd-fases-0-1.md`.
> Conceptos: qué separa CI de CD, por qué filtrar por paths, por qué el SHA como tag, por qué GHCR, y por qué el frontend necesita build-args (y los servicios no).

---

## 1. CI vs CD: dónde trazamos la línea

**CI (Continuous Integration)** responde: *"¿el cambio que acabo de hacer rompe algo?"* — integra y valida.
**CD (Continuous Delivery)** responde: *"¿dejo un artefacto desplegable listo?"* — publica.

La Fase 0 es CI puro: compila backend, frontend y Dockerfiles en cada PR. La Fase 1 es el primer escalón de CD: empaqueta el resultado en imágenes Docker publicadas en un registry. **Nada se despliega todavía** — el despliegue (Fase 3) es un tercer concepto (*Continuous Deployment*), y aquí está bloqueado por una dependencia real: no hay manifiestos de Kubernetes ni clúster. Publicar imágenes ahora no es adelantarse: es dejar listo el único paso de CD que no depende de infraestructura.

**Lección**: un pipeline bueno se diseña alrededor de sus dependencias. Publicar imágenes no necesita nada que no tengamos; desplegar sí. Hacer lo primero sin lo segundo es progreso real, no deuda.

## 2. Path filtering: el pipeline como espejo del cambio

La tentación es "correr todo siempre". El problema es doble:

1. **Feedback lento**: compilar 5 servicios .NET + frontend + 6 imágenes Docker por un cambio de un botón en el frontend quita minutos a cada iteración — y la gente (y las IAs) empiezan a ignorar pipelines lentos.
2. **Señal ruidosa**: cuando todo corre siempre, un fallo en un área que no tocaste se ve como "el pipeline está rojo", no como "mi cambio rompió algo".

La solución es el job `changes` con `dorny/paths-filter`: un job barato que produce outputs booleanos, y cada job downstream decide con `if:` si corre. Esto es el "single source of truth" del alcance del pipeline: el diff determina qué se valida.

**Matiz educativo**: el filtro nativo `paths:` de GitHub Actions existe, pero opera a nivel de *workflow completo* — si pones `paths: frontend/**`, el workflow entero no corre cuando tocas backend, y pierdes la validación cruzada (p. ej. el job docker, que empaqueta cualquier src). El filtro por job conserva la granularidad sin perder el workflow único.

## 3. Validar Dockerfiles en CI sin publicar: `push: false`

Un Dockerfile es código que también se rompe: una ruta mal copiada, un package borrado, una versión de imagen base que desaparece. Pero descubrirlo en "el día del deploy" es lo peor. El job `docker-validation` buildea las 6 imágenes en cada cambio relevante con `push: false`:

- **Es validación pura**: produce la imagen, la tira. Nadie la consume.
- **El cache GHA lo hace barato**: `cache-from/cache-to: type=gha,scope=<imagen>` guarda las capas de build entre corridas en el cache de Actions. Cambiar una línea de código solo recompila la capa final; las capas de `dotnet restore` / `npm ci` quedan cacheadas.
- **Un scope por imagen**: el cache es por clave; si las 6 imágenes compartieran scope, se pisarían entre sí.

**Lección**: "build, no push" es el patrón para todo artefacto costoso de validar: prueba que se *puede* construir, no que se *quiere* publicar.

## 4. Por qué SHA como tag (y no solo `latest`)

`latest` es una referencia móvil: hoy apunta al commit A, mañana al B. Si despliegas `latest` y algo falla, no puedes responder "¿qué código está corriendo?" con precisión, y el rollback es "rezar y volver a pushear".

Con `:<sha>` + `:latest`:

- **Reproducibilidad**: la imagen `ghcr.io/.../auth-service:2ff991c` es inmutable y corresponde a exactamente ese commit. El manifiesto de K8s de la Fase 3 referenciará el SHA — el git commit se convierte en la fuente de verdad del despliegue.
- **Rollback trivial**: `kubectl set image ... :<sha-anterior>` (o su equivalente) — no hay rebuild, la imagen ya existe.
- **`latest` no desaparece**: sigue existiendo como alias cómodo para "lo último de main", pero nada crítico lo referencia.

## 5. GHCR y el GITHUB_TOKEN: el registry sin fricción

GHCR (GitHub Container Registry) tiene una propiedad decisiva para un pipeline: **`GITHUB_TOKEN` ya existe en cada workflow**. Con `permissions: packages: write`, el propio token autentica contra `ghcr.io` con el scope correcto — cero secrets que crear, rotar o filtrar. Las imágenes viven junto al código, heredan la visibilidad del repo, y se limpian con él.

El único detalle: **GHCR exige nombres en minúsculas**. Si el owner del repo tiene mayúsculas, `ghcr.io/MiUsuario/...` falla. Por eso el step `Resolve Image Prefix` hace `${OWNER,,}` (lowercase en bash) antes de construir los tags.

## 6. El caso del frontend: build-time config vs runtime config

Este es el concepto más fino de la sesión. Los 5 servicios .NET reciben su configuración (connection strings, JWT, CORS) **en runtime** por variables de entorno — la imagen es agnóstica del entorno. Pero el frontend no:

- Vite **quema** `import.meta.env.VITE_*` en el bundle en el momento del `npm run build`. No hay "variable de entorno en runtime" para el navegador: el JS ya salió compilado.
- Conclusión: la imagen del frontend **es específica del entorno**. La misma imagen no sirve para staging y prod si las URLs difieren.

Por eso el Dockerfile ahora declara `ARG VITE_*` con defaults de desarrollo, y el workflow CD pasa `--build-arg` desde las **configuration variables** del repo (`vars.VITE_API_URL`, …). Vite prioriza `process.env` sobre archivos `.env`, así que:

- Build local/con compose: defaults `localhost:500x` → comportamiento idéntico al de antes.
- Build en CD: valores del entorno → imagen parametrizada sin tocar código.

Y un matiz de seguridad: las URLs de API **no son secretos** — por eso van en `vars` (visibles, auditables) y no en `secrets` (opacos). Los secretos (`JWT_KEY` en el futuro despliegue) irán a `secrets`.

**Lección general**: cuando un artefacto necesita configuración en build-time, la pregunta de diseño es "¿quién provee esos valores en el pipeline?" — y la respuesta determina la parametrización del Dockerfile. Alternativas más avanzadas (runtime config: `config.json` servido por nginx, o un proxy que reescriba) existen, pero para esta arquitectura los build-args son el equilibrio correcto de simpleza.

## 7. Qué queda y por qué está bloqueado

| Paso | Bloqueado por |
|---|---|
| Desplegar a staging/prod (Fase 3) | Manifiestos K8s (Fase 2) + clúster (kind/k3d primero) + kubeconfig en secrets |
| Imagen de frontend desplegable "de verdad" | Decisión de gateway (una URL única vía ingress → probablemente un solo `VITE_API_URL`) |
| Gates de calidad (tests, análisis de imágenes) | Tests aún no existen; Trivy/Snyk es trabajo futuro |

El orden no es pereza, es topología de dependencias: cada paso desbloquea el siguiente, y ninguno requiere rehacer lo anterior.

## 8. Resumen de conceptos

| Concepto | Dónde se vio |
|---|---|
| CI valida / CD empaqueta / Deployment entrega | Fase 0 vs Fase 1 vs Fase 3 |
| Path filtering por job, no por workflow | Job `changes` + `if:` condicionales |
| Build sin push como validación barata | `docker-validation` con cache GHA |
| Tag inmutable por commit (SHA) + alias móvil (`latest`) | `cd.yml` tags |
| Registry integrado sin secrets extra | GHCR + `GITHUB_TOKEN` + lowercase |
| Build-time vs runtime config | ARGs `VITE_*` del frontend (vs env vars de los servicios) |
| Variables visibles vs secretos | `vars.*` para URLs, `secrets.*` reservado para JWT/kubeconfig |
| Diseñar pipelines por dependencias | Fase 1 ejecutable sin infra; Fase 3 bloqueada con razón documentada |

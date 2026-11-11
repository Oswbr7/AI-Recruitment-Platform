# Sesión 2026-11-06 — Tests replicados a los 4 servicios + CI/CD Fase 3 (deploy.yml)

> **Tipo**: Tests (replicación) + CI/CD (despliegue)
> **Estado al cierre**: ✅ Backend **29/29 tests en verde** (5 proyectos) · deploy.yml validado (YAML + triggers + sed probado contra el render real de ambos overlays). ⚠️ El primer despliegue real queda pendiente de tener un cluster (kind/cloud) — la máquina no puede correr Docker en esta sesión.

---

## 1. Tests replicados a los 4 servicios

### Contexto

El piloto de auth (`AuthService.Tests`, sesión anterior) quedó como plantilla. Esta sesión lo replica a job, company, candidate e interview.

### Verificación previa (exploración con precisión de compilador)

Antes de escribir nada se verificó por agentes exploradores que **estos 4 servicios difieren de auth en el modelo de errores**: devuelven DTOs/Responses directos (no la monada `Result`), devuelven `null` cuando la entidad no existe, y las transiciones inválidas **lanzan `InvalidOperationException` desde la entidad de dominio**. Los tests se escribieron para ese modelo, no copiando ciegamente el patrón de auth.

### Cambios

- **4 proyectos `{Service}.Tests`** (xUnit + Moq, mismo csproj que el piloto, `global using Xunit`, referencia solo a `{Service}.Application`), agregados a la `.slnx` en carpetas `tests/` por servicio.
- **3 archivos de tests por servicio** (12 tests nuevos + 5 del piloto = 29):
  - **Creación** (`CreateJob`/`CreateCompany`/`CreateCandidate`/`ScheduleInterview`): camino feliz capturando la entidad vía callback — verifica invariantes del factory (toda vacancia nace `Draft`, empresa `Active`, candidato `Applied`, entrevista `Scheduled`) y `SaveChangesAsync` exactamente una vez.
  - **Estado** (`PublishJob`/`ArchiveCompany`/`MoveCandidateStage`/`CancelInterview`): no encontrado → `null` y jamás persiste; transición válida → muta, persiste una vez, responde con el estado como string; **transición inválida** → `Assert.ThrowsAsync<InvalidOperationException>` y `Update`/`SaveChanges` `Times.Never`. Para construir entidades en estado imposible (ya publicada/archivada/cancelada) se usan los propios métodos de dominio — los setters son privados, y eso es a propósito.
  - **GetById**: `null` si no existe / mapeo correcto si existe.
- Detalle aplicado: el `JobResponse` de job-service vive en un namespace legacy (`JobService.Application.Jobs.Queries.GetJobs`) que no coincide con su ruta — se usó `var` para no depender del namespace en los asserts.

### Verificación

`dotnet test AIRecruitmentPlatform.slnx -c Release` → **5 proyectos, 29/29 superados** (compiló a la primera).

## 2. CI/CD Fase 3 — `deploy.yml`

### Decisiones

| Decisión | Alternativa | Razón |
|---|---|---|
| Dos jobs (`deploy-staging`/`deploy-production`) con `if:` por tipo de ref | Un job parametrizado con matrix | Los environments de GitHub (aprovals, secrets por ambiente) se asignan por job; matrix rompería eso |
| Trigger: push a `main` → staging; **tag `v*`** → production | Rama `release/*` | El tag es inmutable: lo que se despliega a prod es exactamente un commit identificable; además el SHA ya etiqueta las imágenes en GHCR |
| `workflow_dispatch` con input `type: environment` | Solo triggers automáticos | Permite practicar el deploy sin esperar un push (especialmente útil ahora que no hay cluster) |
| Tags de imagen por **sed sobre el YAML renderizado** (`kubectl kustomize | sed | apply -f -`) | `kustomize edit set image` (requiere instalar kustomize CLI) | `kubectl` ya viene en los runners: cero dependencias extra; el render + sustitución se puede inspeccionar en el log del job |
| Preflight de secrets con mensaje de error guiado | Fallar en `kubectl` con error críptico | Sin cluster configurado, el primer error debe enseñar el setup, no confundir |
| `kubectl rollout status` con `--timeout=300s` por deployment | Apply sin espera | Un workflow "verde" que no espera los pods no dice nada del despliegue real |

### Cambios

- **`.github/workflows/deploy.yml`** (nuevo): checkout → preflight kubeconfig → render + sed (SHA) → reset de Jobs de migración (inmutables) → apply → rollout status. Prefijo de imagen con owner en minúscula (GHCR).
- **`infrastructure/kubernetes/README.md`**: nueva sección "CD" con el setup de los secrets (`KUBECONFIG_STAGING/PRODUCTION`), environments de GitHub (reviewers en prod) e imagePullSecret para imágenes privadas.

### Verificación local (sin Docker/cluster — todo lo verificable)

| Verificación | Resultado |
|---|---|
| YAML parsea (js-yaml): triggers `push`/`workflow_dispatch`, environments staging/production | ✅ |
| **Simulación exacta del paso de render + sed** contra `kubectl kustomize` de ambos overlays | ✅ las 6 imágenes quedan `ghcr.io/<owner>/ai-recruitment/<svc>:<sha>` (postgres intacto) |
| Pendiente por definición | Primer trigger real (cluster + secrets) y comportamiento del approval en production |

## 3. Descubrimientos para la siguiente sesión

1. **La divergencia auth vs. otros 4 servicios** (Result monad vs. excepciones de dominio) es una inconsistencia de estilo conocida: candidata a unificar en una sesión futura (decisión: adoptar la monada en todos, o documentar ambos estilos como válidos).
2. **`ExistsByTaxIdAsync` en `ICompanyRepository` sin uso en Application** — interfaz muerta parcial; candidata a limpieza.
3. Coverlet/cobertura y gates mínimos en CI: ya hay volumen de tests (29) para justificarlo.
4. El namespace legacy `JobService.Application.Jobs.Queries.GetJobs` (no coincide con la ruta) — rename pendiente de bajo riesgo.
5. **Smoke test en kind sigue siendo el siguiente paso crítico** (requiere Docker): validaría bundle de migraciones, ingress y ahora también el flujo del deploy.yml contra un cluster real.

## 4. Qué NO se hizo (y por qué)

- **No se desplegó nada** — sin cluster; el workflow queda validado todo lo validable sin él.
- **No se añadió imagePullSecret a los manifiestos** — depende de si el paquete GHCR será privado; documentado como paso condicional del setup.
- **No se unificó el estilo de errores** (monada vs excepciones) — decisión de diseño con alcance mayor que esta sesión.
- **No se tocaron los tests de componentes ni WebApplicationFactory** — siguiente nivel de la pirámide, documentado.

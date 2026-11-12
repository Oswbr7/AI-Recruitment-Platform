# AGENTS.md — AI Recruitment Platform

Guía para agentes/sesiones de trabajo en este repositorio.

## Qué es el proyecto

Plataforma de reclutamiento (ATS) de aprendizaje: 5 microservicios .NET 10 (`services/`: auth, job, candidate, company, interview) con Clean Architecture + CQRS + Vertical Slice, `building-blocks/` compartidos, y un frontend React 19 + Vite + TypeScript (`frontend/web-app`). El propósito del proyecto es **aprender** las tecnologías y arquitecturas implementadas, no solo construir el producto.

## Convenciones obligatorias de documentación

1. **Worklog por sesión**: cada sesión de trabajo crea `docs/sessions/AAAA-MM-DD-nombre-de-la-sesion.md` con:
   - contexto/problema, verificación previa (qué se comprobó antes de tocar nada), cambios realizados (archivo por archivo), verificación post-cambio (comandos + resultado), descubrimientos para la siguiente sesión, y qué NO se hizo y por qué.
2. **Documento educativo** en `docs/learn/` cuando la sesión tenga contenido de aprendizaje: explicar *por qué* se hace cada cosa y el concepto detrás, no solo el qué.
3. **Actualizar `docs/architecture.md`** siempre que cambie la estructura, proyectos, CI o configuración que ese documento describe (lleva encabezado de "última actualización" — mantenerlo).
4. Si se modifica algo descrito en este archivo, actualizarlo.

## Disciplina de trabajo

- **Nada se borra sin evidencia**: grep de referencias → revisar barrels/DI/registro → borrar → compilar todo.
- **Verificar con builds reales al final**:
  - Backend: `dotnet build AIRecruitmentPlatform.slnx -c Release` (la solución incluye todo lo que importa; los Dockerfiles apuntan a `.csproj` individuales).
  - Frontend: `npm ci` (si falta node_modules) y `npm run build` (tsc + vite) en `frontend/web-app`.
- **Cambios mínimos y enfocados**: no "arreglar de paso" warnings o deuda ajena a la sesión; registrarla en "descubrimientos" del worklog.
- **No crear carpetas/archivos placeholder vacíos**: es exactamente la deuda que el Bloque 1 (2026-11-02) eliminó.
- No ejecutar git mutations (commit/push/etc.) salvo que el usuario lo pida explícitamente.

## Estado actual (ver worklogs en docs/sessions/)

- Bloque 1 (2026-11-02) ✅: limpieza de código muerto (proyectos `.Shared` eliminados, stubs, archivos huérfanos frontend, carpeta `@/`), fix de CI, `.env.example` (docker + frontend), corrección de `architecture.md`.
- Bloque 2 (2026-11-02) ✅: auth-service migrado por completo a Minimal API (eliminado el último controller MVC de la plataforma), `Result` unificados con BuildingBlocks (Errors monad en handlers + Http envelope en endpoints), contrato de login corregido (`{accessToken, expiresAt, user}` — cierra el gap que dejaba al usuario en `null` en el store), clientes Axios unificados en `createApiClient` (interceptor de 401 → logout), `DataTable` con estados `isLoading`/empty conectados a `LoadingSpinner`/`EmptyState`, `UiShowcasePage` en ruta dev-only lazy. ⚠️ Smoke test de runtime del login **pendiente** (Docker Desktop detenido; ver descubrimientos del worklog del Bloque 2).
- CI/CD Fases 0-1 (2026-11-06) ✅: `ci.yml` con path filtering por job (`changes` → backend/frontend/docker validation, docker build sin push + cache GHA) y `cd.yml` que publica las 6 imágenes a GHCR (tags SHA+latest) en push a main. Dockerfile del frontend parametrizado con `ARG VITE_*` (defaults de dev; el CD las sobrescribe con build-args desde `vars.*` del repo). ⚠️ Validación real en GitHub Actions pendiente del primer push.
- CI/CD Fase 2 (2026-11-06) ✅: `infrastructure/kubernetes/` completo — Kustomize base + overlays staging/production, Postgres StatefulSet, 5 Jobs de migración (EF migrations bundle incluido en las imágenes de los 5 servicios), nginx Ingress gateway (`recruitment.local`), Secret documentado en `secrets/README.md` (nunca versionar valores reales), `kind-config.yaml` + README con walkthrough. `kubectl kustomize` validado (26 objetos por overlay). ⚠️ Smoke test en kind pendiente de Docker Desktop.
- Bloque 🔵 organización documental (2026-11-06) ✅: commit aislado de Fase 2 (`dd6c4dc`); eliminados `Notas.md` (obsoleto: su lección de CI ya vive en `ci.yml` y sus curls contradecían los contratos del Bloque 2) y `cap-1.png` (sin referencias); rename `Infraestructure/` → `infrastructure/` (git mv + referencias vivas actualizadas; worklogs históricos intactos); `docs/frontend-tech-debt.md` reescrito a estado 2026-11.
- Tests piloto (2026-11-06) ✅: primeros tests del proyecto — `AuthService.Tests` (xUnit + Moq, 5 tests: LoginHandler/RegisterUserHandler, en la slnx, referencia solo Application) y frontend vitest + jsdom (10 tests: `createApiClient`/interceptores, `queryKeys`, `jobMapper`). CI con gates reales: `dotnet test` y `npm run test` (se elimina el TODO). Patrón documentado en `docs/sessions/2026-11-06-tests-piloto-ci.md`.
- Tests replicados (2026-11-06) ✅: `JobService.Tests`, `CompanyService.Tests`, `CandidateService.Tests`, `InterviewService.Tests` (3 archivos cada uno: creación/invariantes, estado con InvalidOperationException, GetById). **29/29 backend en verde**. Estos 4 difieren de auth: DTOs directos, `null` si no existe, excepciones de dominio (divergencia documentada, candidata a unificar).
- README raíz (2026-11-06) ✅: `README.md` real (quickstart, arquitectura, CI/CD, roadmap).
- CI/CD Fase 3 (2026-11-06) ✅: `deploy.yml` — push a main → environment `staging` (auto), tag `v*` → `production` (approval vía protection rules), `workflow_dispatch` manual. Render `kubectl kustomize | sed` (tags SHA, sin CLI extra), reset de Jobs de migración, rollout status. Simulación local del sed validada en ambos overlays. Setup requerido documentado en `infrastructure/kubernetes/README.md` (secrets `KUBECONFIG_*`, environments, imagePullSecret). ⚠️ Primer deploy real pendiente de cluster.
- Funcionalidad: roles + AI Matching (2026-11-06) ✅: primer usuario registrado = Admin; `PATCH /api/users/{id}/role` (Admin-only, primer uso de `RequireRole`); `role` en `UserSummary`; UI de registro (`/register`, el LoginForm ya enlazaba a una ruta fantasma); `ProtectedRoute` con `roles`; página **AI Matching** (`features/matching`): scoring determinístico explicable (location 25/experience 25/salary 20/pipeline 15/keywords 15) agregado en cliente (patrón Dashboard), ruta `/matching` protegida a Admin/Recruiter. 32/32 backend, 19/19 frontend.
- Funcionalidad: UI admin de usuarios (2026-11-06) ✅: `features/users` (UsersApi getAll/changeRole contra `PATCH /api/users/{id}/role`, hooks React Query con invalidación), `UsersAdminPage` (select de rol por fila, auto-protección: no puedes cambiar tu propio rol), ruta `/admin/users` (Admin), nav con filtro por rol (`NavItem.roles`, ocultar + proteger). 22/22 frontend.
- Funcionalidad: seed de demo (2026-11-06) ✅: `tools/SeedDemo` (app de consola .NET, sin paquetes) que puebla la plataforma **a través de las APIs reales**: admin (primer registro) + recruiter promovido vía PATCH role, 3 empresas, 4 vacantes publicadas, 6 candidatos, 4 entrevistas (1 completada con feedback). Idempotente por clave natural (email/nombre/título). Config por env vars (`AUTH_API`, `ADMIN_EMAIL`, …). En la slnx; ejecución real pendiente de Docker.
- No hay tests de componentes React ni de integración HTTP (siguiente nivel: validadores, WebApplicationFactory, Testing Library). Coverlet/cobertura pendiente a propósito.
- Batería de deuda 🟡 (2026-11-06) ✅: password min 8 alineado (backend validator + registerSchema); `GET /api/users` endurecido a Admin+Recruiter (Candidate ya no enumera usuarios; el directorio de recruiters del scheduling sigue funcionando); warnings NU1510 eliminados (2 PackageReference + 2 PackageVersion, 17→13 warnings); rename namespace legacy `JobService.Application.Jobs.Queries.GetJobs` → `...Features.Jobs.GetJobs` (23 archivos); `shadcn` a devDependencies; scripts `typecheck` + `engines.node >= 24`; export `Sidebar.menu` legacy eliminado. Corrección documental: `ExistsByTaxIdAsync` sí se usa (validators) — retirado de la deuda.
- Pendiente: smoke tests con Docker (auth local + kind + primer deploy real + ejecución del seed + flujo funcional completo); Prettier (sesión propia: config + scripts + posible gate CI); CS8618 (13 warnings nullable en entidades, sesión dedicada); matching v2 (skills estructuradas, backend); unificar estilo de errores (monada vs excepciones); tests de componentes (Testing Library) y de integración (WebApplicationFactory); validadores FluentValidation sin tests; resto de bloque 🟡 (barrels `form/index.ts`, `entity/` sin uso, `SessionService`, rename? — ver `docs/frontend-tech-debt.md`, bundle 1.3 MB); deuda de manifiestos (env repetido → Component Kustomize, HSTS con TLS).

## Contexto operativo

- Windows, SDK .NET 10 (`global.json` fija 10.0.301, rollForward latestFeature). Central Package Management en `Directory.Build.props` / `Directory.Packages.props` — nunca fijar versiones en `.csproj` individuales.
- Stack docker: `infrastructure/docker/`. Requiere copiar `.env.example` → `.env` antes de `docker compose up`.
- El `.env` real nunca se versiona; solo `.env.example`.

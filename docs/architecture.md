# AI Recruitment Platform — Architecture Reference

> Documento generado para servir de contexto completo y preciso del estado real del repositorio, de cara a planificar CI/CD y despliegue en Kubernetes. Refleja el código tal como existe hoy, no las especificaciones originales de los epics (que en varios casos asumían cosas distintas a lo realmente construido).

## 1. Qué es esto

Plataforma de reclutamiento (ATS) construida como un conjunto de microservicios .NET 10 + un frontend React/TypeScript. Módulos: Jobs, Candidates, Companies, Interviews, Auth/Users, y un Dashboard de analítica que agrega datos de los demás módulos.

## 2. Estructura del repositorio (top-level)

```
ai-recruitment-platform/
├── building-blocks/
│   ├── BuildingBlocks.Application     (real, usado por los 5 servicios)
│   ├── BuildingBlocks.Infrastructure  (real, usado por los 5 servicios — Epic-006)
│   ├── BuildingBlocks.Domain          (proyecto vacío, sin usar — stub)
│   └── BuildingBlocks.Contracts       (proyecto vacío, sin usar — stub)
├── services/
│   ├── auth-service/
│   ├── job-service/
│   ├── candidate-service/
│   ├── company-service/
│   └── interview-service/
├── frontend/
│   └── web-app/                        (React + Vite + TypeScript)
├── Infraestructure/
│   ├── docker/                         (docker-compose.yaml, init-db/, .env)
│   └── kubernetes/                     (carpeta vacía — sin manifiestos todavía)
├── postman/ , .postman/                (colecciones/specs de Postman)
├── docs/                               (specs de cada Epic + este documento)
└── Directory.Packages.props            (Central Package Management, root del repo)
```

**No existe un archivo `.sln`.** Cada proyecto se referencia por `ProjectReference` directo; los Dockerfiles hacen `dotnet restore/publish` apuntando al `.csproj` del `Api` de cada servicio, no a una solución.

## 3. Patrón de arquitectura por microservicio

Los 5 servicios (`auth`, `job`, `candidate`, `company`, `interview`) siguen la misma estructura de 5 proyectos (con una salvedad en `auth-service`, ver §7):

```
{Service}/src/
├── {Service}.Api/              — Minimal API endpoints, Program.cs, appsettings
├── {Service}.Application/      — CQRS: Commands/Queries + Handlers + Validators (MediatR + FluentValidation)
├── {Service}.Domain/           — Entidades ricas, Enums, Value Objects, interfaces de Repository
├── {Service}.Infrastructure/   — EF Core DbContext, implementación de Repository/UnitOfWork, DI
└── {Service}.Shared/           — hoy prácticamente vacío (ver §6, Result/PagedResponse se movieron a BuildingBlocks)
```

**Patrones consistentes en los 5 servicios:**

- **Minimal APIs, nunca Controllers** (excepción: `auth-service` mantiene un único `AuthController` MVC legado para login/register — ver §7). Cada endpoint implementa `IEndpoint` (`MapEndpoint(IEndpointRouteBuilder)`), y `EndpointExtensions.MapEndpoints()` los registra todos vía reflexión (`Assembly.GetExecutingAssembly()`), sin registro manual.
- **CQRS con MediatR**, un "vertical slice" por caso de uso: `Command|Query.cs` + `Validator.cs` (FluentValidation) + `Handler.cs` (+ `Response.cs`).
- **Pipeline Behaviors de MediatR** (en `BuildingBlocks.Application/Behaviors/`): `UnhandledExceptionBehavior` → `LoggingBehavior` → `ValidationBehavior`, en ese orden, registrados por servicio en `{Service}.Application/DependencyInjection.cs::AddApplication()`.
- **Repository + IUnitOfWork separados**: los repositorios solo trackean cambios; `IUnitOfWork.SaveChangesAsync()` es el único lugar que confirma en base de datos.
- **Entidades de dominio ricas**: constructor privado, factory estático (`Create(...)` o un verbo de dominio como `Interview.Schedule(...)`), métodos de dominio explícitos para mutar estado, `InvalidOperationException` en transiciones inválidas (mapeado a HTTP 409).
- **Central Package Management**: ningún `.csproj` especifica `Version` en `PackageReference`; todas las versiones viven en `Directory.Packages.props` (raíz del repo).
- **Envelope de respuesta HTTP uniforme** `Result`/`Result<T>` (`{Success, Message, Data}`) y `PagedResponse<T>` (`{Items, Page, PageSize, TotalCount, TotalPages}`) — ahora viven en `BuildingBlocks.Application/Common/Http/` (antes estaban duplicados por servicio, consolidados en Epic-006).
- **`JsonStringEnumConverter`** global vía `ConfigureHttpJsonOptions` — los enums viajan como string en el JSON, no como número.

## 4. Inventario de microservicios

| Servicio | Puerto host | Base de datos | Prefijo de rutas | Notas |
|---|---|---|---|---|
| `auth-service` | 5000 | `recruitmentdb` | `/api/auth/*` (MVC), `/api/users/*` (Minimal API) | Login/registro vía controller legado; queries de usuarios son Minimal API nuevo |
| `job-service` | 5001 | `jobservicedb` | `/api/jobs/*` | `GET /api/jobs` **no está paginado** (devuelve `List<JobResponse>` completo), único caso así |
| `candidate-service` | 5002 | `candidatedb` | `/api/candidates/*` | Paginado (`PagedResponse<T>`); incluye sub-recurso de Notes |
| `company-service` | 5003 | `companydb` | `/api/companies/*` | Paginado; incluye sub-recurso de Contacts |
| `interview-service` | 5004 | `interviewdb` | `/api/interviews/*` | Paginado; incluye sub-recurso de Feedback |
| `postgres` | 5432 | (contenedor único, una BD por servicio) | — | Un solo contenedor Postgres 17 sirve las 5 bases |
| `pgadmin` | 5050 | — | — | Agregado en Epic-006 |
| `frontend` (nginx) | 5173 (contenedor) | — | — | Agregado en Epic-006 — antes solo corría con `npm run dev` fuera de Docker |

Todos los servicios (excepto `auth-service` para login/register) requieren JWT Bearer (`RequireAuthorization()`); el JWT se emite únicamente por `auth-service`.

## 5. Autenticación / JWT

- Emitido solo por `POST /api/auth/login` (`AuthController`, MVC, en `auth-service`).
- Firma simétrica HS256. En Development: `Jwt:Key=SuperSecretKeyForDevelopment123456`, `Jwt:Issuer=RecruitmentPlatform`, `Jwt:Audience=RecruitmentPlatform` — **idénticos en los 5 servicios** (se validan localmente en cada uno, no hay introspección remota).
- Claims: `sub` (user id), `email`, `role`.
- **Gap conocido**: `RegisterUserCommand` fija `Role = UserRole.Candidate` para todo registro — no hay forma de crear un Recruiter/Admin vía API pública hoy; se hace con `UPDATE` directo en Postgres para pruebas.
- **Gap conocido**: el login real (`AuthController.Login`) devuelve solo `{accessToken}`, pero el tipo `LoginResponse` del frontend espera `{accessToken, expiresAt, user}` — mismatch preexistente, no corregido (el frontend decodifica el JWT directamente cuando necesita el user id, ver `SessionService.currentUserId()`).

## 6. `BuildingBlocks.Application` y `BuildingBlocks.Infrastructure`

### `BuildingBlocks.Application` (real, todos los servicios lo referencian)
```
Behaviors/{UnhandledExceptionBehavior,LoggingBehavior,ValidationBehavior}.cs
Common/Errors/{Result,ResultT,Error,ErrorType,ErrorCodes,DomainException}.cs   ← monad de dominio, uso limitado (solo auth-service/UserErrors.cs)
Common/Http/{Result,PagedResponse}.cs                                          ← envelope HTTP real, usado por los 5 servicios (Epic-006)
```
⚠️ Hay **dos tipos distintos llamados `Result`** en este mismo assembly, en namespaces distintos (`Common.Errors` vs `Common.Http`) — no confundirlos. El primero es un outcome monad de dominio poco usado; el segundo es el envelope JSON real que ven los endpoints.

### `BuildingBlocks.Infrastructure` (real, agregado en Epic-006)
```
Options/{JwtOptions,CorsOptions,SwaggerOptions,RateLimitOptions,DatabaseOptions,StorageOptions}.cs
Logging/SerilogConfiguration.cs
Health/HealthCheckExtensions.cs
Correlation/CorrelationIdMiddleware.cs
Middlewares/{SecurityHeadersMiddleware,GlobalExceptionHandler}.cs
Security/JwtAuthenticationExtensions.cs
Compression/ResponseCompressionExtensions.cs
Configuration/OptionsValidationExtensions.cs
Extensions/{WebApplicationBuilderExtensions,WebApplicationExtensions,MigrationExtensions}.cs
```
Expone `AddPlatformInfrastructure(serviceName)` (registro de servicios: Serilog, Options validados con fail-fast, HealthChecks base, ProblemDetails+GlobalExceptionHandler, JWT auth, CORS env-driven, Rate Limiter, Response Compression, Swagger+JWT bearer) y `UsePlatformInfrastructure()` (pipeline de middlewares). Nombrado "Platform" (no "Infrastructure") para no chocar con el `{Service}.Infrastructure.AddInfrastructure()` propio de cada servicio (EF Core + repos), que sigue existiendo sin cambios de nombre.

`BuildingBlocks.Domain` y `BuildingBlocks.Contracts` **existen como proyectos pero están vacíos** (sin archivos `.cs` reales, solo scaffolding) — no asumir que tienen contenido.

## 7. `Program.cs` — forma estándar (4 de 5 servicios)

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.AddPlatformInfrastructure("{ServiceName}");     // Serilog, Options, Health, JWT, CORS, RateLimit, Compression, Swagger
builder.Services.ConfigureHttpJsonOptions(...);          // JsonStringEnumConverter
builder.Services.AddApplication();                       // MediatR + FluentValidation + Behaviors (por servicio)
builder.Services.AddInfrastructure(builder.Configuration); // EF Core + Repos + DB health check (por servicio)

var app = builder.Build();

if (app.Environment.IsDevelopment())
    await app.MigrateDatabaseAsync<ApplicationDbContext>(); // migraciones automáticas SOLO en Development

app.UsePlatformInfrastructure();  // CorrelationId → Serilog request logging → ExceptionHandler → SecurityHeaders →
                                   // HttpsRedirection → Compression → CORS → RateLimiter → Auth/Authz → Swagger(dev)
app.MapEndpoints();
app.MapPlatformHealthChecks();    // /health, /health/live, /health/ready

app.Run();
```

### `auth-service` — el outlier estructural

`auth-service` sigue el mismo patrón `AddPlatformInfrastructure`/`UsePlatformInfrastructure`, pero además:
- Mantiene `builder.Services.AddControllers()` + `app.MapControllers()` para un único `AuthController` (MVC) que expone `POST /api/auth/register` y `POST /api/auth/login` — **deliberadamente no migrado** a Minimal API en ningún epic (riesgo de tocar el flujo de login).
- Tiene además endpoints Minimal API normales (`GET /api/users`, `GET /api/users/{id}`) agregados en un epic posterior, que sí siguen el patrón `IEndpoint` estándar.
- Tiene sus propios `Result` (dos, en `AuthService.Api/Common/Results` y `AuthService.Application/Common/Results`) — **no relacionados** con `BuildingBlocks.Application.Common.Http.Result`; nunca se tocaron por el riesgo de romper el login.

## 8. Infraestructura transversal (Epic-006)

| Aspecto | Estado |
|---|---|
| **Logging** | Serilog (Console + Rolling File en `/app/logs`, Seq preparado pero comentado — sin paquete instalado). Enriquecido con `Service`, `CorrelationId`, `EnvironmentName`, `ThreadId`. Logging estructurado (sin interpolación de strings). |
| **Correlation ID** | Header `X-Correlation-Id`, se reutiliza si ya viene en el request, se genera si no. Presente en todas las líneas de log de un request (incluida la línea de finalización — requiere que `CorrelationIdMiddleware` envuelva a `UseSerilogRequestLogging`, no al revés). |
| **Health Checks** | `/health` (todos los checks), `/health/live` (tag `live`, chequeo trivial de proceso vivo), `/health/ready` (tag `ready`, chequeo real de conectividad a Postgres vía `AspNetCore.HealthChecks.NpgSql`). |
| **Options Pattern** | `IOptions<T>` con `.ValidateDataAnnotations().ValidateOnStart()` — falla al arrancar si falta config crítica (ej. `Jwt:Key` vacío o menor a 32 caracteres). |
| **CORS** | Política `"frontend"`, orígenes desde `Cors:AllowedOrigins` (config/env, nunca `AllowAnyOrigin`). En Development: `http://localhost:5173`. |
| **Rate Limiting** | Fixed window, 100 requests/60s por IP por defecto, configurable vía `RateLimit:*`. Devuelve 429. |
| **Response Compression** | gzip + brotli, habilitado también para HTTPS. |
| **Security Headers** | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Content-Security-Policy`, `X-XSS-Protection`. *(HSTS deliberadamente omitido — solo tiene sentido detrás de un ingress con TLS, pendiente del epic de Kubernetes)*. |
| **Errores** | `IExceptionHandler` único (`BuildingBlocks.Infrastructure.Middlewares.GlobalExceptionHandler`) → RFC7807 `ProblemDetails`/`ValidationProblemDetails` (400 validación, 409 `InvalidOperationException`, 500 default). |
| **Swagger** | Los 5 servicios lo exponen ahora (antes solo 4/5), con esquema de seguridad JWT Bearer, solo en Development. |
| **API Versioning** | **No implementado** — rutas siguen siendo `/api/jobs` sin prefijo `/v1/`. Decisión deliberada para no romper los API clients del frontend; si se necesita versionado real más adelante, es un cambio de rutas + API clients del frontend, no trivial. |
| **OpenTelemetry / Prometheus / Distributed Tracing** | **No implementado**, ni siquiera scaffolding real — es explícitamente terreno para el epic de Kubernetes/observabilidad. |

## 9. Base de datos y migraciones

- Un contenedor Postgres 17 único, con **una base de datos por servicio** (creadas por `Infraestructure/docker/init-db/*.sql` al arrancar el contenedor).
- Migraciones EF Core: se aplican automáticamente **solo si `ASPNETCORE_ENVIRONMENT=Development`**, vía `app.MigrateDatabaseAsync<TContext>()` (genérico, en `BuildingBlocks.Infrastructure`). En cualquier otro ambiente, las migraciones son manuales (`dotnet ef database update`) — **no hay ningún mecanismo de migración pensado para producción/Kubernetes todavía** (un Job/initContainer dedicado es trabajo del futuro epic de K8s).
- Connection strings: `ConnectionStrings:DefaultConnection`, con fallback a `ConnectionStrings:Postgres` en el código de cada servicio (compatibilidad con nombres de variable heredados).

## 10. Docker

### Dockerfile (idéntico en los 5 servicios, patrón multi-stage)
```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore services/{service}/src/{Service}.Api/{Service}.Api.csproj
RUN dotnet publish services/{service}/src/{Service}.Api/{Service}.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .
RUN mkdir -p /app/logs && chown -R $APP_UID:$APP_UID /app
USER $APP_UID
EXPOSE 8080
ENTRYPOINT ["dotnet","{Service}.Api.dll"]
```
Corren como usuario no-root (`$APP_UID`, el que ya trae la imagen `aspnet:10.0` desde .NET 8+) — importante para `securityContext.runAsNonRoot` en Kubernetes más adelante.

### Frontend Dockerfile (nuevo, Epic-006)
Multi-stage `node:24-slim` (build: `npm ci && npm run build`) → `nginx:alpine` sirviendo `dist/` con fallback SPA (`nginx.conf` con `try_files $uri $uri/ /index.html`). Se usa `node:24-slim` (Debian/glibc) en vez de una imagen `-alpine` (musl) porque el motor nativo de Tailwind v4 (`@tailwindcss/oxide`) tiene fricción conocida con musl en el fallback WASM — confirmado durante la verificación end-to-end de este epic.

### `docker-compose.yaml` (`Infraestructure/docker/`)
- Redes: `backend-network` (postgres + pgadmin + los 5 servicios) y `frontend-network` (frontend + los 5 servicios) — no hay red default.
- Volúmenes: `postgres_data` + un volumen de logs por servicio (`{servicio}_logs:/app/logs`).
- **El frontend NO usa reverse-proxy hacia los servicios** — el navegador llama directo a los puertos publicados del host (`http://localhost:5000/api`, `5001`, etc, vía `.env` de Vite: `VITE_API_URL`, `VITE_JOBS_API_URL`, etc, uno por feature). Esto significa que unir el frontend a `frontend-network` con los servicios **no tiene efecto funcional todavía** — es preparación estructural, no una ruta de red activa. Si Kubernetes necesita que el frontend hable con los servicios vía DNS interno del clúster (en vez de vía Ingress público), hay que introducir un proxy real primero (nginx `location /api/jobs { proxy_pass ... }` o un API Gateway).
- No hay Redis ni RabbitMQ (existían como scaffolding sin usar en `docker-compose.yaml`, se confirmó por grep que ningún servicio los referencia, y se eliminaron en Epic-006).

## 11. Frontend (`frontend/web-app`)

- **Stack**: Vite + React 19 + TypeScript, Tailwind, TanStack Query v5, TanStack Table, React Hook Form + Zod, Zustand, Axios, Recharts, `@dnd-kit`, `date-fns`.
- **Estructura por feature** (`src/features/{auth,jobs,candidates,companies,interviews,dashboard}/`), cada una con `api/` (dto + mappers), `models/`, `hooks/`, `components/`, `views/`, `pages/`, `services/`, `schemas/`.
- Cada feature tiene su **propio cliente Axios apuntando a un `VITE_{FEATURE}_API_URL`** — no hay un API Gateway ni base URL única; el navegador llama a cada microservicio por su puerto publicado directamente.
- El **Dashboard** (`features/dashboard`) no tiene backend propio — agrega datos cross-feature enteramente en el cliente (React Query + `useMemo`), reutilizando los hooks/API clients de `jobs`/`candidates`/`companies`/`interviews` directamente. No hay ningún servicio "dashboard-service" ni endpoints `/api/dashboard/*`.
- `shared/query/queryKeys.ts` centraliza las query keys de TanStack Query por dominio (`jobs`, `candidates`, `companies`, `interviews`, `recruiters`).
- No hay tests automatizados en frontend ni backend (fuera de alcance explícito en todos los epics de este proyecto hasta ahora).

## 12. Cosas a tener en cuenta antes de planificar CI/CD y Kubernetes

- **No hay `.sln`** — cualquier pipeline de build debe apuntar a los `.csproj` de cada `*.Api` (y sus dependencias vía `ProjectReference`), no a una solución.
- **`BuildingBlocks.Domain` y `BuildingBlocks.Contracts` están vacíos** — no construir sobre la asunción de que tienen contenido real.
- **`Infraestructure/kubernetes/` existe pero está vacía** — no hay ningún manifiesto todavía, ni siquiera un borrador.
- **El frontend no tiene reverse-proxy hacia los servicios** — cualquier estrategia de Ingress/Service Mesh en K8s necesita decidir si el navegador seguirá golpeando cada servicio por su propio Service/Ingress (replicando el esquema actual de "un puerto por servicio"), o si se introduce un gateway/BFF antes de eso.
- **Los 5 servicios validan JWT localmente con el mismo secreto simétrico compartido** (`Jwt:Key` idéntico) — para Kubernetes esto probablemente se convierte en un `Secret` compartido entre los 5 Deployments; no hay hoy ningún Identity Provider centralizado ni rotación de llaves.
- **Migraciones automáticas solo corren en Development** — hace falta decidir la estrategia real para Kubernetes (Job/initContainer, migración manual pre-deploy, etc.) antes de escribir los manifiestos.
- **La verificación end-to-end del stack completo vía `docker compose up` ya se hizo** (los 8 contenedores arrancan, health checks reales en verde, JWT válido entre servicios, usuario no-root confirmado, redes `backend-network`/`frontend-network` correctas). En el camino se corrigieron 3 problemas reales: `package-lock.json` del frontend desincronizado, fricción de `node:20-alpine` (musl) con el motor nativo de Tailwind v4 (se cambió a `node:24-slim`), y `PGADMIN_EMAIL` con un TLD `.local` que pgadmin rechaza. También se agregó `.dockerignore` (raíz + frontend), que no existía y hacía que el build context incluyera `node_modules`/`bin`/`obj`/`.git` completos.
- **`RegisterUserCommand` fuerza el rol `Candidate`** — no hay forma de crear un Recruiter vía API pública; probablemente haya que resolver esto antes de tener un flujo de seed/onboarding real en un ambiente desplegado.
- Unit tests, OpenTelemetry, Prometheus y Distributed Tracing están **explícitamente fuera de alcance** hasta ahora — si el plan de CI/CD asume gates de cobertura de tests o dashboards de métricas, hoy no hay nada de eso implementado, solo la intención declarada en el epic de infraestructura.

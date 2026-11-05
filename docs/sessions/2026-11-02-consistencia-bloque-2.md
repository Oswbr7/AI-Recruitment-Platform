# Sesión 2026-11-02 — Consistencia Bloque 2: auth-service unificado, factory de HTTP, estados del DataTable

> **Tipo**: Refactor de consistencia (backend + frontend)
> **Alcance**: Punto 6 (outlier auth-service), Punto 7 (clientes Axios), Punto 8 (duplicados semánticos frontend)
> **Estado al cierre**: ✅ Builds en verde (`dotnet build` 0 errores, `npm run build` tsc+vite OK). ⚠️ Smoke test de runtime **pendiente**: Docker Desktop no está corriendo y la instancia de Postgres local (puerto 5432, PID 6476) rechaza las credenciales `postgres/postgres` (28P01) — no es la BD del proyecto. Cuando Docker esté disponible: `cp Infraestructure/docker/.env.example Infraestructure/docker/.env && docker compose up -d` y probar register/login.

---

## 1. Contexto y problema

Tras el Bloque 1 (limpieza), quedaban tres fuentes de inconsistencia que hacían que `auth-service` y el frontend se comportaran distinto al resto de la plataforma:

| # | Inconsistencia | Costo |
|---|---|---|
| 6 | `auth-service` era el único servicio con un controller MVC (`AuthController`), dos implementaciones propias de `Result` (Api + Application) y un contrato de login que no coincidía con lo que el frontend esperaba | Todo cambio de plataforma (DTOs, envelope, manejo de errores) había que hacerlo dos veces; el usuario quedaba en `null` en el store tras el login |
| 7 | 5 clientes Axios copia-pega (idénticos salvo `baseURL`) en `shared/api/` | Cualquier interceptor nuevo (p.ej. refresh de token, manejo de 401) habría que duplicarlo 5 veces; ya habían divergido en formato |
| 8 | `EmptyState`/`Loading` existían pero ningún componente los usaba (el `DataTable` mostraba "No results." a mano); `UiShowcasePage` (herramienta interna) expuesta como ruta de producción | Componentes compartidos muertos; una página interna accesible en prod |

## 2. Verificación previa

- **Los `Result` de auth-service NO eran código muerto** (a diferencia de lo asumido en la auditoría del Bloque 1): el grep mostró que `LoginCommand`, `RegisterUserCommand` y sus handlers los usan en producción. Se migraron, no se borraron.
- Los dos `Response.cs` (Login y Register) **sí eran código muerto** (sin referencias fuera de sí mismos) → eliminados.
- `UserErrors.cs` vivía en el proyecto **Api** con namespace de Application — los handlers (proyecto Application) no podían usarlo sin invertir la dirección de las dependencias → se movió a Application.
- `Results.Unauthorized()` en .NET 10 **no acepta cuerpo** → el 401 del login usa `Results.Json(envelope, statusCode: 401)`.
- No hay fallback policy de autorización global (`JwtAuthenticationExtensions` solo registra el esquema Bearer; la autorización es por-endpoint con `RequireAuthorization()`) → los endpoints de login/register son anónimos por defecto, sin necesidad de `AllowAnonymous()`.
- Los 5 clientes Axios eran byte a byte iguales salvo `baseURL` y nombre del export → la unificación no cambia comportamiento ni exports (`api`, `jobsApi`, `candidatesApi`, `companiesApi`, `interviewsApi` se conservan: cero cambios en consumidores).
- `EmptyState` real (`empty-state/EmptyState.tsx`) se usa en 15+ lugares; `LoadingSpinner` (`loading/LoadingSpinner.tsx`) no se usaba en ningún lado.

## 3. Cambios realizados

### 3.1 Punto 6 — auth-service (backend)

**Nuevos archivos:**
- `AuthService.Api/Endpoints/auth/LoginEndpoint.cs` — `POST /api/auth/login` (Minimal API, patrón `IEndpoint`). Éxito → `LoginResponse` directo (sin envelope, es el contrato del frontend). Fallo → 401 con envelope.
- `AuthService.Api/Endpoints/auth/RegisterEndpoint.cs` — `POST /api/auth/register`. Éxito → envelope `Result<Guid>` (convención de plataforma). Email duplicado → **409 Conflict** (antes 400 BadRequest; sin consumidores en el frontend, seguro).
- `AuthService.Application/Features/Auth/Login/LoginResponse.cs` — `LoginResponse(AccessToken, ExpiresAt, UserSummary(Id, FullName, Email))`. **Cierra el gap documentado**: el backend devolvía solo `{accessToken}` y el frontend esperaba `{accessToken, expiresAt, user}` — por eso el usuario quedaba `undefined` en el store tras login y `UserSection` lo mostraba en blanco.
- `AuthService.Application/Common/Errors/UserErrors.cs` — movido desde el proyecto Api.
- `AuthService.Application/Abstractions/Authentication/GeneratedToken.cs` — record `(AccessToken, ExpiresAt)`.

**Editados:**
- `IJwtProvider.Generate` ahora devuelve `GeneratedToken` (la duración de 8h se define una sola vez en `JwtProvider` y viaja con el token).
- `LoginHandler` / `RegisterUserHandler` / `LoginCommand` / `RegisterUserCommand` migrados de `AuthService.Application.Common.Results.Result<T>` (strings sueltos) a `BuildingBlocks.Application.Common.Errors.Result<T>` con `UserErrors.InvalidCredentials` / `EmailAlreadyExists`.
- `JwtProvider` — calcula `expiresAt` una vez; constante `TokenLifetime` extraída.
- `Program.cs` — eliminados `AddControllers()` y `MapControllers()`.
- `GetUsersEndpoint` / `GetUserByIdEndpoint` — using de `AuthService.Api.Common.Results` → `BuildingBlocks.Application.Common.Http`.

**Eliminados:**
- `Controllers/AuthController.cs` (+ carpeta) — el último controller MVC de la plataforma.
- `AuthService.Api/Common/Results/Result.cs` (idéntico al envelope de BuildingBlocks).
- `AuthService.Application/Common/Results/Result.cs` (reemplazado por la monada de BuildingBlocks).
- `Login/Response.cs` y `Register/Response.cs` (código muerto confirmado por grep).

**Contratos cambiados (documentados):**
| Endpoint | Antes | Ahora | Consumidor | Riesgo |
|---|---|---|---|---|
| `POST /api/auth/login` éxito | `{accessToken}` | `{accessToken, expiresAt, user}` | Frontend `AuthApi.login` — **ahora coincide con `LoginResponse`** | Ninguno; arregla bug real |
| `POST /api/auth/login` fallo | 401 + string plano | 401 + envelope `{success, message}` | Frontend ignora el cuerpo de errores | Ninguno |
| `POST /api/auth/register` éxito | 200 + Guid plano | 200 + envelope `{success, message, data}` | Sin consumidor en frontend | Bajo |
| `POST /api/auth/register` duplicado | 400 | 409 Conflict | Sin consumidor en frontend | Bajo |

### 3.2 Punto 7 — clientes Axios (frontend)

- **Nuevo `src/shared/api/httpClient.ts`** — `createApiClient(baseURL)` con los dos interceptores de plataforma: request (adjunta JWT Bearer desde `useAuthStore`) y response (ante **401 cierra la sesión local** → `ProtectedRoute` redirige al login; cualquier otro error se propaga intacto para React Query/la UI).
- Los 5 archivos de cliente quedaron de 1 línea de factory cada uno, **mismos nombres de export** (`api`, `jobsApi`, `candidatesApi`, `companiesApi`, `interviewsApi`) → cero cambios en los consumidores.
- Comportamiento nuevo y deliberado: un 401 en cualquier servicio limpia la sesión. Antes el token expirado quedaba guardado hasta que el usuario recargaba/rec logueaba manualmente.

### 3.3 Punto 8 — duplicados semánticos (frontend)

- **`DataTable.tsx`**: nuevas props opcionales `isLoading`, `emptyTitle`, `emptyDescription`. En `isLoading` renderiza `LoadingSpinner`; sin filas renderiza `EmptyState` (antes un "No results." hardcodeado). Los dos componentes compartidos dejan de estar muertos. Uso opt-in: ninguna página existente se ve afectada hasta que pase la prop.
- **`AppRouter.tsx`**: `UiShowcasePage` movida a ruta **solo-desarrollo** (`import.meta.env.DEV`) con `React.lazy` + `Suspense`. Verificado en el build de producción: el showcase sale como chunk separado de 1.7 KB (`UiShowcasePage-q7fhsU2e.js`) fuera del bundle principal de 1.3 MB.

### 3.4 Documentación

- `docs/architecture.md`: encabezado de actualización, §4 (fila auth-service), §5 (gap de login → resuelto; gap de registro de Recruiter sigue), §6 (uso real de la monada Errors), §7 (sección del outlier reescrita: "ya NO es outlier"), §11 (factory de clientes + ruta /ui dev-only).

## 4. Verificación post-cambio

| Comando | Resultado |
|---|---|
| `dotnet build AIRecruitmentPlatform.slnx -c Release` | ✅ 0 errores |
| `npm run build` (tsc -b && vite build) | ✅ OK — tsc valida que `LoginResponse` del frontend sigue coincidiendo con lo que consume `AuthApplicationService` |
| Chunk de prod (`dist/assets/`) | ✅ `UiShowcasePage-*.js` separado (1.7 KB), fuera del bundle principal |
| Smoke test runtime (register → login → GET /api/users con JWT) | ⚠️ **Pendiente** — Docker Desktop detenido y Postgres local (5432) no es del proyecto (rechaza credenciales). Pasos cuando Docker vuelva: levantar stack con `.env`, registrar usuario, login y validar el JSON `{accessToken, expiresAt, user}`, y llamar `/api/users` con el token |

## 5. Descubrimientos para la siguiente sesión

1. **Smoke test de auth pendiente** (ver arriba) — es la verificación que falta para dar por cerrado el punto 6 al 100%.
2. **`docker-compose.yaml` apunta a `${POSTGRES_DB}` para auth-service pero hardcodea las demás BD** — coherente con `init-db/01-create-databases.sql`; vale la pena documentar en el README cuando se escriba.
3. **El 401-auto-logout puede chocar con el flujo de login**: si el usuario con sesión expirada entra a `/login` y falla la autenticación, el interceptor hace logout (no-op si ya estaba limpio). Comportamiento correcto, pero conviene probarlo en el smoke test.
4. **`docs/frontend-tech-debt.md` quedó parcialmente obsoleto**: los archivos vacíos que listaba ya se borraron en el Bloque 1. Actualizarlo o reemplazarlo por "resuelto" en el bloque 🔵.
5. **`SessionService.currentUserId()` sigue decodificando el JWT a mano** — ya no es necesario como workaround del gap de login, pero sigue siendo una forma válida de obtener el `sub` sin red de API. Candidato a simplificación futura (bloque 🟡 restante: README, `engines`, typecheck script).

## 6. Qué NO se hizo (y por qué)

- **No se agregó UI de registro** — el frontend solo consume login; el endpoint de registro queda para API consumers (curl/Postman/futura UI).
- **No se implementó refresh token** — `Register/Response.cs` lo mencionaba, pero nunca existió en el contrato real; es trabajo de un epic de auth futuro.
- **No se migró el rol forzado a `Candidate`** — gap conocido que requiere decisión de producto (seed/onboarding), no de refactor.
- **No se actualizó `docs/frontend-tech-debt.md`** — pendiente del bloque 🔵 junto con `Notas.md`/`cap-1.png`.

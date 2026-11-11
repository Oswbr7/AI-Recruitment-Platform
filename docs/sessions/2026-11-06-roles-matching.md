# Sesión 2026-11-06 — Funcionalidad: Roles de usuario + AI Matching

> **Tipo**: Features de aplicación (backend + frontend + tests)
> **Estado al cierre**: ✅ Backend 32/32 tests · Frontend build OK + 19/19 tests (9 nuevos del scoring)

---

## 1. Contexto y problema

Dos deudas funcionales cerradas, elegidas por el usuario tras revisar las opciones:

1. **Roles** (gap más viejo del repo, desde `architecture.md` §5): el registro forzaba `Role = Candidate` para todo el mundo; crear un Recruiter/Admin requería `UPDATE` directo en Postgres.
2. **Matching** (la "AI" del nombre del producto): la ruta `/matching` existía comentada en el `AppRouter` y el link "AI Matching" languidecía en el Sidebar sin página.

## 2. Roles — cambios

### Backend (auth-service)

- **`RegisterUserHandler` — primer usuario = Admin**: regla de arranque self-hosted. `GetAllAsync().Count == 0` → `Admin`; el resto nace `Candidate`. Resuelve el hueco sin exponer auto-elevación (nadie puede registrarse como Admin arbitrariamente; solo el primero en una base vacía).
- **`PATCH /api/users/{id}/role`** (nuevo): `ChangeUserRoleCommand/Handler` (Features/Users/ChangeRole) + endpoint con `.RequireAuthorization(policy => policy.RequireRole("Admin"))` — la autorización basada en roles existía en el JWT (claim `role`) pero nunca se usaba; este es su primer consumidor. Body `{ "role": "Recruiter" }` (enum, binding por `JsonStringEnumConverter`).
- **`IUserRepository.UpdateAsync`** agregado (impl: `_context.Users.Update`) — antes la interfaz era de solo-lectura+alta; el cambio de rol necesitaba mutación explícita, siguiendo el patrón UpdateAsync de los otros servicios.
- **`UserSummary` del login gana `Role`** — el frontend necesita el rol para sus guards, y el login es el único momento en que el backend entrega el usuario completo.
- **Tests**: register con base vacía → Admin; con usuarios → Candidate; `ChangeUserRoleHandler` (no existe → `null` y no persiste; existe → cambia, `UpdateAsync` + `SaveChangesAsync` una vez); login assert de `"Recruiter"` en el contrato.

### Frontend

- **`User.role`** + contratos (`RegisterRequest`, `AuthApi.register`, `registerSchema` con min 6 en password — paridad con `RegisterUserCommandValidator`), `useRegister`, `RegisterForm`, `RegisterPage`.
- **Ruta `/register` pública** — el `LoginForm` ya enlazaba a `/register` desde siempre; la ruta no existía (404 al clic). Ahora fluye: registro → toast → login.
- **`ProtectedRoute` acepta `roles?: string[]`** — autenticado sin rol permitido → redirect a `/`. La ruta `/matching` lo usa con `["Admin", "Recruiter"]`.

## 3. AI Matching — cambios

### Decisión de diseño

Scoring **determinístico y explicable** (no LLM todavía): mismas entradas → mismos puntos, con desglose auditable por dimensión. Vive en el **cliente**, siguiendo el patrón documentado del Dashboard (agregación cross-feature con TanStack Query + `useMemo`, query keys centralizadas → cache compartido con las páginas de jobs/candidates). No requiere cambios de esquema ni backend: usa solo campos existentes (ubicación, años de experiencia, expectativa salarial, etapa del pipeline, headline/posición/resumen vs. título/departamento/descripción).

### `features/matching/`

- **`scoring.ts`** (puro): pesos location 25 / experience 25 / salary 20 / pipeline 15 / keywords 15 = 100. Reglas documentadas en el código: remoto acepta cualquier ubicación; nivel requerido mapea a años umbrales (EntryLevel 0 … Executive 10); expectativa dentro del rango 20, bajo el piso 10 (negociable), sobre el techo 5; pipeline prioriza candidatos recién aplicados (Applied 15 … Hired/Rejected 0); keywords = intersección de tokens (≥4 chars) × 5, tope 15. Datos ausentes puntúan **neutral** (nunca penalizan).
- **`useJobMatches`**: `useJobs` (selector) + `useJobDetail(selectedJobId)` + `useCandidates({page, pageSize: 100})` → `rankCandidates` memoizado.
- **`MatchingPage`**: selector de vacante, tabla rankeada (rank, candidato, headline, badge de score con semáforo, desglose por dimensión, años, expectativa salarial), estados con `LoadingSpinner`/`EmptyState` (los componentes que el Bloque 2 conectó al DataTable, reusados).

## 4. Verificación

| Verificación | Resultado |
|---|---|
| `dotnet test` (5 proyectos) | ✅ 32/32 (auth subió de 5 a 8) |
| `npm run build` | ✅ 0 errores TS |
| `npm run test` | ✅ 19/19 (9 nuevos: scoring 8 + ajuste httpClient por `User.role`) |
| Endpoints/rutas nuevos | Pendiente de smoke test con Docker (registro → login con role → PATCH role → matching render) |

Incidentes de la sesión: `UserRole` sin using en 2 tests (CS0103) → global using añadido por archivo; fixtures de `httpClient.test.ts` rotos al exigirse `role` en `User` → el compilador hizo su trabajo (el typecheck como red de regresión de contratos); test de keywords con overlap de 2 tokens en vez de 3 → fixture ajustado, expectativa 100 confirmada.

## 5. Descubrimientos para la siguiente sesión

1. **Smoke test funcional pendiente** (requiere Docker): flujo completo registro (primer usuario admin) → login (role en respuesta) → PATCH role → matching con datos reales.
2. **UI de administración de usuarios**: el endpoint `PATCH /api/users/{id}/role` existe pero solo es consumible por API client; una página de Users admin (tabla + cambio de rol) sería la siguiente pieza natural.
3. **Matching v2**: scoring en backend (cuando el matching necesite datos que el cliente no tiene, p.ej. parsing de CV), skills estructuradas (campo nuevo candidato/vacante), pesos configurables.
4. **Divergencia menor**: `loginSchema` exige password min 8 pero el registro acepta min 6 (reglas del backend); conviene alinear (decisión: subir el registro a 8).
5. El primer Admin nace del registro, pero en un deploy real con seed debería venir del seed — conectar cuando exista el script de demo.

## 6. Qué NO se hizo (y por qué)

- **No se añadió página de administración de usuarios** — el endpoint queda disponible para API clients (curl/Postman); la UI es la siguiente sesión natural.
- **No se usó LLM para el matching** — decisión deliberada: scoring explicable primero (testeable, didáctico, sin costo); la versión con IA queda como evolución documentada.
- **No se persistió el scoring** ni se agregó el campo `skills` a las entidades — requiere migración y decisión de producto; el scoring actual funciona con los campos existentes.
- **No se restringieron más rutas por rol** (p.ej. interviews a Recruiter) — el guard existe y es trivial de aplicar; mejor decidir el mapa de permisos completo en una sesión dedicada.

# Sesión 2026-11-19 — "Mis aplicaciones" para el rol Candidate

> **Tipo**: Feature de funcionalidad + seguridad (backend + frontend + seed + tests)
> **Estado al cierre**: ✅ Backend **139/139** (105 unitarios + 34 integración) · Frontend build + **23/23** + format:check en verde

---

## 1. Contexto y problema

Aplicaciones existía como vista de gestión (Admin/Recruiter), pero un usuario con rol `Candidate` no tenía forma de ver "sus" aplicaciones — y detrás de eso había dos problemas de diseño encontrados al planear:

1. **No existía vínculo usuario↔candidato**: `User` (auth-service) y `Candidate` (candidate-service) eran agregados independientes.
2. **Brecha de privacidad real**: `GET /api/applications?candidateId=X` aceptaba cualquier autenticado — cualquiera podía enumerar las aplicaciones de cualquier candidato.

## 2. Decisiones

| Decisión | Alternativa | Razón |
|---|---|---|
| `Candidate.UserId` nullable + índice único **con filtro parcial** (`UserId IS NOT NULL`) | Tabla de vínculos separada | El vínculo es 1:1 y la opcionalidad es real (perfiles creados por recruiters no tienen dueño). El filtro parcial Postgres permite múltiples NULLs en un índice único |
| Creación de perfil **manual guiada** | Auto-crear al registrarse | Sin perfiles basura para staff; el "empty state" de la página guía la creación |
| **`GET /api/applications/mine`** con resolución interna (`sub → candidato → aplicaciones`) | Filtrar por candidateId en el cliente | El candidateId jamás viaja por URL — es la cerradura de la brecha, no solo una vista nueva |
| Cierre de la brecha en la misma sesión | Sesión aparte | La brecha era consecuencia directa del feature anterior; dejarla abierta mientras se publica /mine sería peor |
| Roles como **string literals** en candidate-service | Referenciar `UserRole` de auth-service | Acoplar dos servicios por un nombre de claim es exactamente el tipo de dependencia que esta arquitectura evita; los roles son strings en el JWT |

## 3. Cambios realizados

### Backend (commit `7f6d7dc`)
- `Candidate.UserId` + migración `AddCandidateUserId` + `GetByUserIdAsync` (repo).
- Slices CQRS: `GetMyProfile`, `CreateMyProfile` (+ validator), `GetMyApplications`.
- Endpoints: `GET/POST /api/candidates/me`, `GET /api/applications/mine` (registrada ANTES de `/{id:guid}` — las rutas literales tienen prioridad sobre constraints). User id siempre del claim `sub`, patrón change-password.
- `GET /api/applications` (filtros libres) → `RequireRole("Admin", "Recruiter")`.
- 6 tests de integración nuevos: flujo completo (404 sin perfil → creo → apply → /mine → withdraw), 409 de perfil duplicado, 403 Candidate en GET de gestión, 200 Recruiter.

### Frontend + seed (este commit)
- `myProfileApi` (getMine devuelve `null` en 404 — UX amable, no error), `useMyProfile`/`useCreateMyProfile`, `queryKeys.candidates.me`.
- `useMyApplications` (`/applications/mine`), `ApplicationsTable` con **`actionsMode: "candidate"`** (solo Withdraw — espejo del dominio una vez más).
- **`MyApplicationsPage`** (`/my-applications`): sin perfil → formulario de creación guiada; con perfil → tarjeta de perfil + tabla. Nav: entrada visible solo para rol `Candidate`.
- **Botón Apply** en el detalle de vacante (rol Candidate + perfil existente + no aplicado aún — derivado de `useMyApplications` client-side porque el GET filtrado ya no es accesible al Candidate). 409 → toast "Ya aplicaste". La sección "Applicants" se oculta para Candidates (consulta restringida).
- **SeedDemo**: usuario `candidate@demo.local` (3er registro) + perfil propio + 2 aplicaciones en estados distintos — el demo muestra ambas vistas (gestión y candidato).

## 4. Verificación

| Comando | Resultado |
|---|---|
| `dotnet build` (slnx + SeedDemo) | ✅ 0 warnings, 0 errores |
| `dotnet test` | ✅ **139/139** (Candidate 35+16, Auth 22+11, Job 14+4, Interview 18+4, Company 12+3) |
| `npm run build` / `test` / `format:check` | ✅ 0 errores · 23/23 · limpio |
| Flujo real con Docker | Pendiente (smoke test integral) |

Incidentes: assert de `fullName` inexistente en `CandidateResponse` (son firstName/lastName); tipado de `variant` en acciones de candidato; narrowing de `profile` (`!profile` cubre null y undefined post-loading).

## 5. Descubrimientos

1. **El filtro parcial de índice único** (`HasFilter`) es la herramienta correcta para "único cuando existe" — lección de Postgres/EF aplicable a cualquier vínculo opcional 1:1.
2. **Ocultar + proteger volvió a aparecer**: la sección Applicants se oculta al Candidate (UX) y el GET se restringe (seguridad) — las dos caras del mismo cambio.
3. El `alreadyApplied` derivado client-side desde `/mine` es correcto pero tiene el límite de `pageSize: 100` — documentado; con volumen real conviene un endpoint `GET /api/jobs/{id}/my-application`.

## 6. Qué NO se hizo (y por qué)

- **Edición de perfil** — feature separada (UpdateProfile ya existe en backend; falta UI).
- **`alreadyApplied` server-side** — requiere el endpoint por vacante mencionado arriba; el límite de 100 cubre el demo.
- **Notificaciones al candidato cuando cambia el estado** — timeline/eventos (la puerta a mensajería sigue en el roadmap).
- **Auto-vínculo de perfiles existentes** — los 6 candidatos del seed no tienen UserId (creados por recruiter, correctamente); el vínculo ocurre solo por el flujo /me.

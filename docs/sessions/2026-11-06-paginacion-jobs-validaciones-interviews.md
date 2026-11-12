# Sesión 2026-11-06 — Paginar GET /api/jobs + validaciones de negocio en scheduling de entrevistas

> **Tipo**: Consistencia de API + reglas de dominio (backend + frontend + tests)
> **Estado al cierre**: ✅ Backend 39/39 tests (5 proyectos) · Frontend build OK + 22/22 · SeedDemo actualizado y compilando

---

## 1. Contexto y problema

Dos capítulos abiertos cerrados:

1. **`GET /api/jobs` era el único listado sin paginar** (deuda documentada desde el Bloque 1 en `architecture.md` §4): devolvía `List<JobResponse>` completo mientras los otros 4 servicios usan `PagedResponse<T>`.
2. **El scheduling de entrevistas no validaba nada**: permitía agendar dos procesos activos para el mismo candidato/vacante y encimar entrevistas en la agenda del mismo recruiter.

## 2. Paginación de jobs

### Backend

- `IJobRepository`: `GetAllAsync` → **`GetPagedAsync(page, pageSize, search, status, companyId, sortBy, sortDirection, ct)`** (tupla `(Items, TotalCount)`, espejo del patrón de candidate/company). Implementación con búsqueda en título/departamento/ubicación, filtros de status y companyId, y ordenamiento (`title`, `location`, `status`, default `CreatedAt`).
- `GetJobsQuery`: ahora con los parámetros de paginación → `IRequest<PagedResponse<JobResponse>>`; handler construye el `PagedResponse` (TotalPages calculado).
- `GetJobsEndpoint`: acepta query params (`page`, `pageSize`, `search`, `status`, `companyId`, `sortBy`, `sortDirection`) → `Result<PagedResponse<JobResponse>>.Ok(...)`.

### Frontend — decisión de mínima intrusión

Los 7 consumidores de `useJobs` (JobsView, CompanyTable, CompanyDetailView, dashboard ×2, CandidateSection, InterviewTable) esperan un **array**. En vez de tocarlos a todos: `JobApi.getJobs` ahora devuelve `PagedResult<Job>` (contrato real), pero **`useJobs` desempaqueta `.items` y aplica `pageSize: 100` por defecto** — cero cambios en consumidores; `queryKeys.jobs.list(params)` sigue funcionando por prefijo. Cuando JobsView migre a paginación server-side (el DataTable ya soporta `manualPagination`), su hook llamará a `jobApi.getJobs` directamente.

### SeedDemo

`EnsureJob` parseaba `data` como array plano → ahora `data.items` (predicho en el worklog del seed). El chequeo de idempotencia sigue igual.

### Tests

`GetJobsQueryHandlerTests` (2): `PagedResponse` con Items/TotalCount/Page/PageSize/**TotalPages = ceil(25/10) = 3** + verificación de que los filtros llegan al repo; mapeo a responses.

## 3. Validaciones de scheduling de entrevistas

### Reglas implementadas (en el handler, antes de crear)

- **Duplicado candidato+vacante**: `ExistsActiveForCandidateAndJobAsync` → si ya hay una entrevista `Scheduled` para ese par, lanza `InvalidOperationException` ("An active interview already exists for this candidate and job.").
- **Solapamiento de agenda del recruiter**: `HasOverlapForRecruiterAsync(recruiterId, scheduledAt, durationMinutes)` → si otra `Scheduled` del recruiter se solapa (`x.ScheduledAt < end && x.ScheduledAt + duration > start`), lanza con la fecha/hora.

Ambas excepciones se mapean a **HTTP 409** por el `GlobalExceptionHandler` (patriento de la plataforma, architecture §3/§8) — sin tocar el manejo de errores.

### Tests (2 nuevos, 8/8 en interview)

- Duplicado → `ThrowsAsync<InvalidOperationException>`, `Add`/`SaveChanges` `Times.Never`.
- Solapamiento → ídem (y el happy path existente sigue verde porque Moq devuelve `false` por defecto en los nuevos métodos sin configurar).

## 4. Verificación

| Comando | Resultado |
|---|---|
| `dotnet build` (slnx + SeedDemo) | ✅ 0 errores |
| `dotnet test` | ✅ 39/39 (Job 8, Interview 8, Auth 11, Company 6, Candidate 6) |
| `npm run build` / `npm run test` | ✅ 0 errores · 22/22 |
| Contrato paginado end-to-end (curl real) | Pendiente de smoke test con Docker |

Incidentes de la sesión: helper de test llamado `Job` chocando con el tipo entidad (CS0119/CS1955 — renombrado a `JobWithTitle`); edit fallido por formato de Prettier en JobApi (releído y reaplicado — misma lección de la sesión anterior).

## 5. Descubrimientos

1. **La paginación server-side queda lista para JobsView**: el DataTable ya soporta `manualPagination`/`onPaginationChange` — la migración es de la vista solamente.
2. Las validaciones de scheduling son **del dominio del proceso**, no de la entidad: involucran consultas entre entrevistas, así que viven en el handler (la entidad `Interview` solo conoce su propia máquina de estados). Es el límite natural entre lógica de dominio y orquestación.
3. Falta una validación análoga en `RescheduleInterview` (puede encimar agenda al mover) — candidata natural registrada para otra sesión.

## 6. Qué NO se hizo (y por qué)

- **Paginación server-side en JobsView** — el contrato ya la permite; la migración de la vista (estado de paginación en la URL/tabla) es una sesión propia.
- **Validación de solapamiento en `RescheduleInterviewHandler`** — misma mecánica; registrada como siguiente paso natural (además debe excluirse a sí misma del chequeo).
- **Validación de existencia de candidato/vacante al agendar** — requiere llamada HTTP entre servicios (candidate/job viven en otra BD): decisión arquitectónica (comunicación sync vs eventual) pendiente, como ya se documentó en architecture.md.

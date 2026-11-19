# Sesión 2026-11-19 — Applications: el backbone del dominio ATS

> **Tipo**: Feature de dominio (backend + frontend + seed + tests)
> **Estado al cierre**: ✅ Backend **133/133** (101 unitarios + 32 integración) · Frontend build + **23/23** + format:check en verde · build 0 warnings/0 errores

---

## 1. Contexto y problema

El ATS vinculaba candidato↔vacante solo al agendar entrevistas: no existía el concepto central de cualquier sistema de reclutamiento — la **aplicación** con su propio ciclo de vida. Esta sesión la introduce completa: dominio, API, UI y datos de demo.

## 2. Decisiones de diseño

| Decisión | Alternativa | Razón |
|---|---|---|
| **Aggregate en candidate-service** (top-level `/api/applications`) | Nuevo application-service | El aprendizaje de la sesión es el DOMINIO (aggregate, máquina de estados, invariantes), no scaffolding; la extracción a servicio propio queda como ejercicio mecánico documentado. Además, el Submit puede validar la existencia del CANDIDATO (misma BD) |
| Entidad `JobApplication` (no `Application`) | — | `Application` chocaría con el namespace `CandidateService.Application` — documentado en la clase |
| **Una aplicación activa por candidato+vacante** | Sin restricción | Regla de negocio real del ATS (sin límite histórico: una rechazada/retirada no bloquea reaplicar) |
| Terminales `Rejected`/`Withdrawn` inmutables | Permitir reactivar | Los terminales que se reactivan destruyen la auditabilidad del pipeline; reaplicar crea un registro nuevo |
| `Reject`/`Withdraw` desde cualquier no-terminal (incluida `Offered`) | Solo desde estados tempranos | Realismo: una oferta puede ser rechazada por la empresa O declinada por el candidato (Withdrawn) |
| No validar existencia de la VACANTE al submit | Llamada a job-service | Consistencia eventual documentada (mismo criterio que interviews); el candidato sí se valida porque vive en la misma BD |

## 3. Cambios realizados

### Backend (commit `e7689d9`)
- **Dominio**: `JobApplication` (factory `Submit` con guards de Guid vacío, máquina de estados `StartReview/MoveToInterviewing/Offer` con transiciones estrictas desde-estado, `Reject/Withdraw` libres desde no-terminales, `EnsureNotTerminal` en todo mutador), enums `ApplicationStatus`/`ApplicationSource`, `IJobApplicationRepository`.
- **EF**: `JobApplicationConfiguration` (status/source como string con índices por JobId/CandidateId — las rutas calientes del ATS), migración `AddApplications`, repositorio con `GetPagedAsync` (filtros candidateId/jobId/status) y `ExistsActiveForCandidateAndJobAsync`.
- **CQRS + API**: 7 slices + validator; 8 endpoints (`POST /api/applications` → 201, GET paginado con filtros, GET /{id}, 5 verbos de transición). Los handlers de transición son idénticos salvo el método de dominio — generados por plantilla (mismo criterio que los manifiestos k8s).
- **Tests**: 24 unitarios nuevos (máquina de estados con Theory sobre terminales/transiciones/rechazos, handlers con `Times.Never` en fallos, validator) + 6 de integración (pipeline Applied→Offered por HTTP, duplicado 409, transición inválida 409, filtro por vacante, 404 de candidato inexistente).

### Frontend + seed (este commit)
- **`features/applications/`**: modelo, DTO, mapper, `ApplicationsApi`, hooks con invalidación de `queryKeys.applications`, `ApplicationsTable` compartida (acciones por estado — **espejo declarativo de la máquina de estados del dominio**, con badges y estados terminales sin acciones), `ApplicationsPage` con filtros por vacante/estado y resolución de nombres (patrón recruiters de InterviewTable).
- **Detalle de vacante**: sección "Applicants" (espejo de Contacts en empresa).
- **Ruta `/applications`** con guard `Admin`/`Recruiter`; entrada en navegación filtrada por rol.
- **SeedDemo**: 5 aplicaciones en estados distintos (Interviewing/Applied/Offered/Rejected/Reviewing) — el funnel del dashboard cobra vida; idempotente por par candidato+vacante, con walker de transiciones.

## 4. Verificación

| Comando | Resultado |
|---|---|
| `dotnet build` (slnx + SeedDemo) | ✅ 0 warnings, 0 errores |
| `dotnet test` | ✅ **133/133** (Candidate 35 unit + 10 int, Auth 22+11, Job 14+4, Interview 18+4, Company 12+3) |
| `npm run build` / `npm run test` | ✅ 0 errores · 23/23 (queryKeys applications) |
| `npm run format:check` | ✅ |
| Flujo real end-to-end | Pendiente de smoke test con Docker |

Incidentes: `Reach` helper de test no llegaba a estados terminales (`ArgumentOutOfRange` en el Theory — corregido con ramas directas Reject/Withdraw); typo de import lucide/react-router en JobDetailView; helper `TERMINAL` tipado como array de strings (narrowing de union type).

## 5. Descubrimientos

1. **`JobApplication` vs namespace**: el compilador hace su trabajo también con nombres de tipos vs namespaces — el rename preventivo costó 0 y evitó ambigüedades eternas.
2. **Las acciones del frontend como espejo de la máquina de estados** (`ACTIONS: Record<status, transitions[]>`) es el patrón a mantener: un solo lugar declara qué se puede hacer desde dónde, en dominio y UI.
3. El siguiente paso natural del dominio: **interviews colgando de applications** (`Interview.ApplicationId?`) — hoy siguen con candidateId+jobId directos; la migración es opcional y queda documentada.

## 6. Qué NO se hizo (y por qué)

- **Extracción a application-service** — ejercicio mecánico futuro (checklist de scaffolding ya conocido).
- **Interviews colgando de applications** — decisión de modelado pendiente; el vículo actual funciona.
- **Offers como entidad propia** (salario ofrecido, expiración, aceptación) — el estado `Offered` basta por ahora; la entidad llega cuando haya datos que guardar.
- **Vista "mis aplicaciones" para rol Candidate** — la página actual es de gestión (Admin/Recruiter); la vista de candidato es feature futura.
- **Dashboard funnel con datos de applications** — el dashboard agrega en cliente; conectar applications es trabajo de UI sobre datos ya disponibles.

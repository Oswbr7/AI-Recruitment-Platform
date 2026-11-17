# Sesión 2026-11-06 — Tests de integración (piloto auth-service con WebApplicationFactory)

> **Tipo**: Tests (nivel integración HTTP) + 2 bugs reales encontrados por los tests
> **Estado al cierre**: ✅ **11/11 integración · 88/88 total backend** (5 proyectos unitarios + integración) · build 0 warnings/0 errores

---

## 1. Contexto y problema

La pirámide de tests tenía unidades (77) pero ningún test ejercía la **cadena HTTP real**: serialización JSON, envelopes, emisión/validación de JWT, `RequireRole`, behaviors de MediatR y el mapeo de excepciones del `GlobalExceptionHandler` trabajando juntos. Esta sesión subió un nivel con `WebApplicationFactory`.

## 2. Qué se construyó

- **`AuthService.IntegrationTests`** (nuevo proyecto en la slnx): `WebApplicationFactory<Program>` sobre la API real con:
  - **EF Core InMemory** (sin Docker/Postgres) — base con nombre único por instancia de factory
  - **environment "Integration"** — las migraciones automáticas solo corren en Development
  - **Config vía `UseSetting`** (Jwt, Cors, connection string dummy para el fail-fast de `AddInfrastructure`)
  - `Program.cs` expuesto con `public partial class Program;`
  - Paquetes nuevos en CPM: `Microsoft.AspNetCore.Mvc.Testing 10.0.8`, `Microsoft.EntityFrameworkCore.InMemory 10.0.8`
- **11 tests** en 2 clases:
  - `AuthFlowTests` (7): registro → envelope con Guid; duplicado → 409; login mal password → 401; login → token+user+role; **primer usuario Admin / segundo Candidate**; cambio de password con password actual equivocada → 400; cambio válido → re-login con la nueva funciona.
  - `AuthorizationTests` (4): sin token → 401; token Candidate en PATCH de rol → 403; Admin promueve → 200 y el recruiter re-logueado lista usuarios (regla Admin+Recruiter de la batería); validación FluentValidation → 400.

## 3. Dos bugs REALES encontrados por los tests (el verdadero valor de la sesión)

### Bug 1 — auth-service nunca registró `JsonStringEnumConverter`

El PATCH `/api/users/{id}/role` devolvía **400**: el enum `Role` no ligaba desde `{"role":"Recruiter"}`. Los otros 4 servicios registran el converter en su `Program.cs`; auth lo perdió en alguna de sus reescrituras. **El admin UI de usuarios (sesión anterior) habría fallado en el primer uso real.** Corregido en `Program.cs`.

### Bug 2 (semántica, no código) — los claims del JWT se hornean al emitir

Tras promover un usuario a Recruiter, su token **existente** sigue diciendo "Candidate" hasta expirar (8h) — el test falló con 403 hasta re-loguear. Es comportamiento estándar de JWTs, pero es una **deuda de producto registrada**: cambios de rol no aplican a sesiones activas (mitigación futura: tokens cortos + refresh, como ya estaba en el roadmap).

## 4. La odisea del diagnóstico (educativa, registrada completa)

1. `ConfigureAppConfiguration` + `AddInMemoryCollection` **no llegó** a la configuración del app con minimal hosting → solución: `UseSetting` (fluye vía host configuration).
2. `AddInfrastructure` falla sin connection string (fail-fast) → dummy vía `UseSetting` (el DbContext se reemplaza después; el health check NpgSql nunca se invoca).
3. Los tests fallaban con **409 "Conflict"** — asumí "email duplicado / estado compartido" y perseguí aislamiento de DB durante varias corridas. Un test diagnóstico reveló la verdad: era el `InvalidOperationException` de **EF Core por tener DOS providers registrados** (Npgsql del `AddInfrastructure` original + InMemory) — que el `GlobalExceptionHandler` mapea a 409. **El error de infra se disfrazaba del error de negocio.** Faltaba remover `IDbContextOptionsConfiguration<AppDbContext>` (interno en EF 10 — se localiza por nombre de tipo).
4. `InMemoryDatabaseRoot` **fue eliminado en EF Core 10** (verificado compilando una sonda contra la DLL — no existía en ningún namespace).

Lección general: cuando un test de integración falla con el status code EQUIVOCADO, sospechar primero del exception handler — los errores de infra heredan los códigos de negocio.

## 5. Verificación

| Comando | Resultado |
|---|---|
| `dotnet build AIRecruitmentPlatform.slnx` | ✅ 0 warnings, 0 errores |
| `dotnet test` (completo) | ✅ **88/88** (Auth 22 + Integration 11, Interview 18, Job 14, Company 12, Candidate 11) |

## 6. Descubrimientos para la siguiente sesión

1. **Patrón replicable**: los otros 4 servicios pueden tener su `X.IntegrationTests` copiando `AuthApiFactory` (misma mecánica de reemplazo de DbContext + UseSetting). El paquete InMemory ya está en CPM.
2. Coverlet + gate de cobertura en CI: con 88 tests, el siguiente paso natural de calidad.
3. `IClassFixture` para compartir factory entre tests de solo-lectura (ahorro de arranques) — hoy cada test levanta app (9s por 11 tests; aceptable).
4. El bug del JsonStringEnumConverter sugiere auditar los otros Program.cs por drift respecto a la "forma estándar" de §7 (un test de integración por servicio lo pescaría).

## 7. Qué NO se hizo (y por qué)

- **Integración en los otros 4 servicios** — el piloto valida el patrón; replicación mecánica para otra sesión.
- **Testcontainers (Postgres real)** — requiere Docker; el InMemory cubre el 90% del valor por cero infraestructura. Queda como evolución junto al smoke test.
- **`IClassFixture`/compartir factory** — optimización prematura; el aislamiento por factory es la semántica correcta para estado.

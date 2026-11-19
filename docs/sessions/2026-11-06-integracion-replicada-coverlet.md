# Sesión 2026-11-06 — Integración replicada a los 4 servicios + intento de cobertura (revertido con hallazgo)

> **Tipo**: Tests (replicación de integración) + investigación de cobertura
> **Estado al cierre**: ✅ **103/103 backend** (77 unitarios + 26 integración en 5 proyectos) · build 0 warnings/0 errores

---

## 1. Replicación de tests de integración (piloto → 4 servicios)

El patrón del piloto (`docs/sessions/2026-11-06-tests-integracion.md`) se replicó a job, candidate, company e interview: mismo `WebApplicationFactory` (InMemory + env Integration + `UseSetting`), mismo gotcha del `IDbContextOptionsConfiguration`, factories generadas por sustitución del de auth, `Program.cs` expuesto con `partial class` en los 4.

**15 tests nuevos** (26 integración en total), cada servicio ejerciendo su frontera específica:

| Servicio | Tests | Qué ejercen |
|---|---|---|
| job | 4 | creación (envelope), validación 400 (title vacío), **transición de estado** (create→publish→GET = Published), **contrato de paginación** (items/totalCount/totalPages) |
| candidate | 4 | creación, 400 (email inválido), transición (move→GET = Screening), paginación |
| company | 3 | creación (**201 Created**), 400 (nombre vacío), **TaxId duplicado → 400** — la regla async `MustAsync` corre en el pipeline real contra EF InMemory |
| interview | 4 | creación, **duplicado candidato+vacante → 409**, **solapamiento de agenda → 409** (las reglas de negocio del handler como HTTP reales), 400 (duration 0) |

Detalles que los tests aclararon: el schedule de interviews devuelve **201 Created** (no 200 como asumí — dos assertions corregidas); los endpoints de candidates usan `POST /{id}/move` con body `{stage}` string.

Token en los 4: se genera JWT en el test con la misma clave/issuer/audience del factory (`System.IdentityModel.Tokens.Jwt`, ya en CPM) — funciona porque los 5 servicios validan con el secreto compartido documentado.

## 2. Coverlet — revertido con hallazgo registrado

Se intentó la cobertura con `coverlet.msbuild` en los 5 proyectos de tests unitarios. La medición arrojó **"100%" con ~40 líneas por proyecto** — imposible (los handlers solos tienen más líneas): coverlet estaba instrumentando un subconjunto sin significado (configuración por defecto sin filtros Include/Exclude ni merge entre proyectos).

**Decisión: revertido por completo** (paquetes + `coverage.json`), siguiendo el principio del proyecto de la Fase 0: *un paso de pipeline con métrica falsa es peor que su ausencia*. La cobertura queda como sesión propia con el problema ya diagnosticado: necesita `coverlet.runsettings` con filtros (excluir DTOs/mappers triviales si se desea), merge multi-proyecto y recién entonces un umbral con significado.

## 3. Verificación

| Comando | Resultado |
|---|---|
| `dotnet build AIRecruitmentPlatform.slnx` | ✅ 0 warnings, 0 errores |
| `dotnet test` (completo) | ✅ **103/103** (5 unitarios: 77 + 5 integración: 26) |
| Frontend | Sin cambios |

Incidente de la sesión: un `sed` de limpieza de coverlet borró cierres `</PackageReference>` legítimos (mismo patrón que el huérfano) rompiendo 10 csproj; reparado con perl (insertar cierre antes de `</ItemGroup>`) y reescritura limpia de los 4 integration csprojs. Lección: los sed multi-archivo sobre XML estructural merecen `dotnet build` inmediato después — y mejor aún, no usar sed para XML.

## 4. Qué NO se hizo (y por qué)

- **Gate de cobertura en CI** — depende de la configuración correcta de coverlet (sesión propia, problema ya diagnosticado en §2).
- **Testcontainers (Postgres real)** — sigue en el roadmap junto al smoke test con Docker.
- **Más escenarios de integración** (notes/contacts/feedback sub-recursos, paginación con filtros complejos) — replicación mecánica sobre el patrón establecido.

# Sesión 2026-11-06 — Tests: piloto backend (xUnit + Moq) + frontend (vitest) + gates en CI

> **Tipo**: Tests automatizados (primera cobertura del proyecto) + CI
> **Estado al cierre**: ✅ Backend 5/5 tests en verde · Frontend 10/10 en verde · `npm run build` y `dotnet build` OK · CI actualizado (tests reactivados en ambos jobs)

---

## 1. Contexto y problema

El proyecto tenía **cero tests** en backend y frontend — limitación explícita de todos los epics y bloqueador declarado para gates de calidad en CI (el paso de tests había sido removido del workflow con un TODO en la sesión de CI/CD Fase 0). Esta sesión establece el patrón mínimo viable: un piloto por lado, elegido donde el retorno es mayor.

## 2. Decisiones tomadas (y por qué)

| Decisión | Alternativa | Razón |
|---|---|---|
| **Backend: piloto en auth-service** (`LoginHandler` + `RegisterUserHandler`) | Empezar por un servicio CRUD | Login/register es el flujo con más riesgo (sesión de consistencia lo tocó), tiene lógica condicional real (credenciales, duplicados, construcción del `LoginResponse`) y dependencias puramente mockeables |
| **xUnit + Moq** | fakes manuales / NSubstitute | Estándar .NET; Moq expresa setups/verificaciones de comportamiento (`Times.Never/Once`) que es justo lo que se prueba aquí |
| El proyecto de tests referencia **solo `AuthService.Application`** | Referenciar Api/Infrastructure | Los handlers se prueban aislados con abstracciones mockeadas — si el test necesitara Infrastructure, sería señal de que el handler tiene lógica de infra (diseño, no test, sería el problema) |
| **Frontend: vitest + jsdom, lógica pura primero** | Testing Library de componentes de entrada | Los primeros bugs reales del frontend estuvieron en la frontera (interceptores, contratos DTO, query keys) — es el mejor ROI antes de pagar el costo de renderizar componentes |
| Tests **colocalizados** (`*.test.ts` junto al fuente) | Carpeta `tests/` | Descubribles por proximidad; es el default de vitest; obliga a que el módulo sea importable de forma aislada |
| `globals: true` en vitest pero con **imports explícitos** de vitest | Usar globals sin imports | Evita tocar `tsconfig` (types de vitest/globals) — cero fricción con `tsc -b` |

## 3. Cambios realizados

### 3.1 Backend

- **`services/auth-service/tests/AuthService.Tests/`** (nuevo, en la `.slnx` bajo `/services/auth-service/tests/`):
  - `LoginHandlerTests` (3 tests): usuario inexistente → `InvalidCredentials` y jamás genera token; password incorrecta → `InvalidCredentials`; credenciales válidas → `LoginResponse` con `accessToken`, `expiresAt` y `UserSummary` (verifica el contrato que consume el frontend — el mismo que se corrigió en el Bloque 2).
  - `RegisterUserHandlerTests` (2 tests): email duplicado → `EmailAlreadyExists` y **nada se persiste** (`Times.Never` en Add y SaveChanges); registro válido → captura la entidad agregada, verifica hash/rol/Guid devuelto y `SaveChangesAsync` **exactamente una vez** (la regla UnitOfWork de §3 architecture.md).
- `Directory.Packages.props`: `Microsoft.NET.Test.Sdk 17.14.1`, `Moq 4.20.72`, `xunit 2.9.3`, `xunit.runner.visualstudio 3.0.1` (Central Package Management, sin versiones en el csproj).
- `AuthService.Tests.csproj`: `global using Xunit` vía `<Using Include>` (evita repetir using en cada archivo).

### 3.2 Frontend

- `vitest.config.ts` (nuevo): alias `@` replicado del `vite.config.ts`, entorno jsdom (localStorage para el store persistido).
- `src/shared/api/httpClient.test.ts` (4 tests): con `vi.mock("axios")` se capturan los handlers de interceptores y se invocan directamente — Bearer adjunto con sesión / sin header sin sesión / **401 → logout** / otros errores propagan sin tocar la sesión. Usa el store real de zustand.
- `src/shared/query/queryKeys.test.ts` (1 test): jerarquía y derivación de sub-recursos (`notes`/`contacts`/`feedback` derivan de `detail` → invalidación en cascada de TanStack Query).
- `src/features/jobs/api/mappers/jobMapper.test.ts` (3 tests): campos directos + conversión de fechas a `Date`; `null` del DTO → `undefined` del modelo (salarios/moneda/empresa); fechas opcionales null → undefined.
- `package.json`: scripts `test` (vitest run) y `test:watch`.

### 3.3 CI (`.github/workflows/ci.yml`)

- `backend-validation`: se reemplaza el TODO por el paso real `Run Unit Tests` (`dotnet test --no-build`).
- `frontend-validation`: nuevo paso `Test` (`npm run test`) entre lint y build.
- Verificado parseando el YAML resultante: steps correctos en ambos jobs.

## 4. Verificación

| Comando | Resultado |
|---|---|
| `dotnet test AIRecruitmentPlatform.slnx -c Release` | ✅ 5/5 (862 ms) |
| `npm run test` | ✅ 10/10 (3 archivos, 3.1 s) |
| `npm run build` (tsc -b incluye ahora los tests) | ✅ 0 errores |
| `dotnet build` | ✅ 0 errores |
| YAML de ci.yml post-ediciones | ✅ (jobs/steps inspeccionados) |

Incidentes durante la sesión (y su corrección): faltó el `using Xunit` inicial (CS0246) → resuelto con global using en el csproj; warning de Vite por `__dirname` en ESM → `import.meta.dirname`.

## 5. Descubrimientos para la siguiente sesión

1. **Replicar el patrón**: los otros 4 servicios siguen el mismo esquelema (handler + repositorio mockeado); el piloto queda como plantilla documentada.
2. **Siguiente frontera de tests**: validadores FluentValidation (LoginValidator/RegisterUserCommandValidator — trivialmente testeables) y los endpoints (WebApplicationFactory sobre la API, un paso más de integración).
3. **Componentes**: Testing Library entra cuando haya un componente con lógica de verdad (sugerido: `DataTable` con isLoading/empty).
4. Cobertura (coverlet) y gate mínimo de cobertura en CI: posible ya, postergado a propósito (primero volumen de tests útiles, luego métricas).
5. `shadcn` sigue en `dependencies` (deuda conocida del bloque 🔵) — un movimiento de una línea.

## 6. Qué NO se hizo (y por qué)

- **No se testearon los otros 4 servicios** — es replicación mecánica; la sesión estableció patrón y verdes, no volumen.
- **No se añadió cobertura ni análisis de mutación** — métricas antes que tests útiles sería ceremonia sin contenido.
- **No se testearon componentes React ni endpoints HTTP** — la pirámide se sube por niveles; la base (unidades puras) ya existe. WebApplicationFactory y Testing Library quedan como siguiente nivel documentado.
- **No se restauró `dotnet test` en cd.yml** — el CD publica imágenes; la calidad se valida en CI antes de mergear a main, que es el gate correcto.

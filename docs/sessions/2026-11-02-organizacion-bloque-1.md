# Sesión 2026-11-02 — Organización Bloque 1: limpieza de código muerto, CI y `.env.example`

> **Tipo**: Limpieza / organización (sin cambios funcionales)
> **Alcance**: Backend .NET, frontend React, CI, documentación de arquitectura
> **Estado al cierre**: ✅ Verificado — `dotnet build` (0 errores) y `npm run build` (tsc + vite) en verde
> **Motivación**: El documento `docs/architecture.md` (referencia para planificar CI/CD y Kubernetes) describía cosas que ya no existían en el repo o que nunca existieron. Esta sesión alinea documento y realidad, y elimina el código muerto que generaba esa deriva.

---

## 1. Contexto y problema

Auditoría previa del repo (ver detalle en `docs/architecture.md`, encabezado "Última actualización") detectó 6 discrepancias entre el documento de arquitectura y el código real, más deuda de scaffolding acumulada en backend y frontend. Este bloque resuelve las 5 primeras acciones priorizadas:

| # | Acción | Resultado |
|---|--------|-----------|
| 1 | Corregir `docs/architecture.md` | ✅ §2, §3, §6 y §12 actualizados |
| 2 | Limpiar archivos muertos del backend | ✅ 6 archivos + 4 proyectos `.Shared` eliminados |
| 3 | Limpiar archivos muertos del frontend | ✅ 18 archivos + carpeta `@/` eliminados |
| 4 | Arreglar CI (`.github/workflows/ci.yml`) | ✅ Apunta a la slnx real; paso de tests removido |
| 5 | Crear `.env.example` (frontend + docker) | ✅ 2 plantillas creadas y documentadas |

## 2. Verificación previa (lo que se comprobó ANTES de borrar)

Regla aplicada en toda la sesión: **ningún archivo se borró sin demostrar primero que nada lo referencia.**

| Decisión | Evidencia |
|---|---|
| Los `Result` propios de `auth-service` (Api + Application) **se conservan** | Son usados por el flujo real de login/register (`LoginCommand`, `RegisterUserCommand`, `LoginHandler`, `RegisterUserHandler`) y por los endpoints `GET /api/users*`. Borrarlos habría roto el login. |
| `AuthService.Api/Common/Exceptions/GlobalExceptionHandler.cs` **se borra** | Grep en todo `auth-service`: la clase existe pero **nunca se registra** en `Program.cs` ni en ningún DI. El handler activo es el de `BuildingBlocks.Infrastructure` (registrado por `AddPlatformInfrastructure`). Código muerto duplicado. |
| Los 4 proyectos `{Service}.Shared` **se eliminan** | Cada carpeta contenía **solo el `.csproj`** (0 archivos `.cs`), y estaban referenciados por 12 `.csproj` (Api/Application/Infrastructure de job, candidate, company, interview). Ningún código los usaba. |
| Stubs `Class1.cs` (4 archivos) **se borran** | Clase plantilla de `dotnet new classlib`, sin referencias. |
| 16 archivos frontend de 0 bytes + `Sidebar.tsx` (100% comentado) + `dashboard/DashboardPage.tsx` (huérfano) **se borran** | Grep de imports sobre `src/`: ninguno es importado. El `EmptyState` real (`empty-state/EmptyState.tsx`) sí se usa en 15+ lugares y se conserva. Los barrels (`form/index.ts`, `entity/index.ts`) no reexportaban nada de lo borrado. `UiShowcasePage` importa solo `Buttons/Cards/BadgesSection`, no las 4 secciones vacías eliminadas. |
| Carpeta `@/` en la raíz de `web-app` **se borra** | Output erróneo del CLI de shadcn (interpretó el alias `@/` como path literal). No importada desde ningún lado; `components.json` solo contiene strings de configuración. Los componentes shadcn reales viven en `src/components/ui/`. |
| `src/shared/components/data-table/*` **se conserva** | A diferencia de lo reportado en la auditoría, los archivos NO están vacíos (2.6–7.3 KB c/u). Feature en progreso. |
| `src/shared/layouts/` **se conserva** | `DashboardLayout.tsx` (en uso) sigue ahí; solo se borró `PublicLayout.tsx` (vacío). |

## 3. Cambios realizados

### 3.1 Backend

**Eliminados (archivos):**
- `building-blocks/BuildingBlocks.Domain/Class1.cs`
- `services/auth-service/src/AuthService.Application/Class1.cs`
- `services/auth-service/src/AuthService.Domain/Class1.cs`
- `services/auth-service/src/AuthService.Infrastructure/Class1.cs`
- `services/auth-service/src/AuthService.Api/Common/Exceptions/GlobalExceptionHandler.cs` (+ carpeta `Exceptions/` vacía)

**Eliminados (proyectos completos):**
- `JobService.Shared/`, `CandidateService.Shared/`, `CompanyService.Shared/`, `InterviewService.Shared/` — cada uno solo contenía su `.csproj`

**Editados (12 `.csproj`):** removida la línea `<ProjectReference Include="..\{Service}.Shared\{Service}.Shared.csproj" />` en Api, Application e Infrastructure de los 4 servicios. Los `ProjectReference` a BuildingBlocks quedan intactos.

**Editada `AIRecruitmentPlatform.slnx`:**
- Agregado: `building-blocks/BuildingBlocks.Infrastructure/BuildingBlocks.Infrastructure.csproj` (¡estaba en el disco pero fuera de la solución! El CI no lo compilaba).
- Removidas las 4 entradas `{Service}.Shared`.
- Resultado: 18 proyectos en la solución (antes 22 con 4 vacíos y 1 faltante).

**Conservado deliberadamente:** los `Result` de auth-service (flujo de login real) y `BuildingBlocks.Domain` (stub vacío que puede servir en el futuro; documentado como tal).

### 3.2 Frontend (`frontend/web-app`)

**Eliminados (18 archivos):**
- `src/features/jobs/services/JobApplicationService.ts` (0 bytes)
- `src/features/ui/index.ts`, `sections/{Dialogs,Forms,Icons,Tables}Section.tsx` (0 bytes, sin imports)
- `src/shared/components/common/{EmptyState,ErrorState,Loading}.tsx` (0 bytes; los reales viven en `empty-state/` y `loading/`)
- `src/shared/components/dashboard/{DashboardPage,StatCard}.tsx` (huérfanos duplicados de `features/dashboard/`)
- `src/shared/components/form/{CheckboxField,SelectField,TextAreaField}.tsx` (0 bytes)
- `src/shared/components/{Logo,Navbar}.tsx` (0 bytes), `Sidebar.tsx` (100% comentado)
- `src/shared/layouts/PublicLayout.tsx` (0 bytes)
- Carpeta `@/` en la raíz del proyecto (error del CLI de shadcn)

### 3.3 CI — `.github/workflows/ci.yml`

- `RecruitmentPlatform.sln` → `AIRecruitmentPlatform.slnx` (el archivo anterior no existía → el CI estaba roto desde su creación).
- Removido el paso `Run Unit Tests` con comentario `TODO` explicando que se re-agregará cuando existan proyectos de test (hoy no hay ninguno en backend ni frontend; un `dotnet test` sin tests sería un falso positivo).

### 3.4 Variables de entorno documentadas

- **`frontend/web-app/.env.example`**: las 5 `VITE_*_API_URL` (una por microservicio, puertos 5000–5004 en local), con advertencia de que Vite solo expone el prefijo `VITE_` y que nunca deben ponerse secretos ahí.
- **`Infraestructure/docker/.env.example`**: `POSTGRES_USER/PASSWORD/DB`, `JWT_KEY` (≥32 chars, validado fail-fast), `JWT_ISSUER/AUDIENCE`, `PGADMIN_EMAIL/PASSWORD`. Incluye la nota del TLD `.local` que pgadmin rechaza (lección del Epic-006).

### 3.5 Documentación

- `docs/architecture.md`: §2 (solución slnx, estructura real de carpetas, `.env.example`), §3 (estructura de 4 proyectos por servicio), §6 (solo `BuildingBlocks.Domain` existe como stub; `Contracts` nunca existió), §12 (checklist CI/CD-K8s actualizado). Añadido encabezado de "Última actualización" con enlace a este documento.

## 4. Verificación post-cambio

| Comando | Resultado |
|---|---|
| `dotnet build AIRecruitmentPlatform.slnx -c Release` | ✅ **0 errores** (17 warnings preexistentes de nullable reference types en entidades de dominio — no introducidos por esta sesión) |
| `npm ci` + `npm run build` (tsc -b && vite build) | ✅ Build OK en ~800ms — confirma que ningún archivo borrado era referenciado |

Nota: se rumoreaba que `AuthController` tenía un `using` que no compilaba — **falso**, la solución completa compila.

## 5. Descubrimientos para el siguiente bloque

1. **`BuildingBlocks.Infrastructure` tenía 2 `PackageReference` redundantes** (warnings NU1510: `Microsoft.Extensions.Options.ConfigurationExtensions` y `.DataAnnotations` ya vienen con el framework). Limpieza de un línea, candidata al bloque 2.
2. **`docker-compose.yaml` no usa `${POSTGRES_DB}` en auth-service** (usa `Database=${POSTGRES_DB}` — sí lo usa) pero los demás servicios hardcodean su base (`jobservicedb`, etc.). Coherente con `init-db/01-create-databases.sql`; documentar.
3. **Warnings CS8618** (non-nullable props en constructores privados de entidades): preexistentes, candidatos a `required` o inicialización — deuda menor de dominio.
4. **El bundle del frontend pesa 1.3 MB** (warning de Vite) — code-splitting por ruta sería una buena tarea de aprendizaje para otro bloque.

## 6. Qué NO se hizo (y por qué)

- **No se migró `AuthController` a Minimal API** — es la acción 6 de la lista priorizada (bloque 🟡), tocando el flujo de login requiere su propia sesión con pruebas manuales.
- **No se creó `Infraestructure/kubernetes/`** — pertenece al epic de K8s; crear una carpeta vacía hoy solo recrearía el problema que esta sesión elimina.
- **No se unificaron los 5 clientes Axios** — bloque 🟡 (acción 7).
- **No se tocó `Notas.md`, `cap-1.png`, ni el rename de `Infraestructure/`** — pendientes del bloque 🔵 (organización documental).

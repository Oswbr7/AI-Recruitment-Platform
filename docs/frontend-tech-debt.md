# Frontend — deuda técnica pendiente (`shared/components`)

Lista de hallazgos de la revisión de `frontend/web-app/src/shared/components` (2026-07-23). No son errores de compilación — el build está limpio — son duplicados/código huérfano para limpiar en un sprint dedicado.

## Bug funcional ya corregido
- ~~`UserSection.tsx` mostraba "Oswaldo" / "Software Engineer" hardcodeado en vez del usuario real~~ → ahora lee `useAuthStore`.

## Archivos duplicados (versión "plana" vs. versión en subcarpeta — solo una está conectada a la app)

| Huérfano (sin usar) | Real (conectado a la app) |
|---|---|
| `shared/components/Logo.tsx` (vacío) | `shared/components/common/AppLogo.tsx` (usado por `AuthHeader`) |
| `shared/components/Navbar.tsx` (vacío) | `shared/components/navigation/Navbar.tsx` (usado por `DashboardLayout`) |
| `shared/components/Sidebar.tsx` (100% código comentado) | `shared/components/navigation/Sidebar.tsx` (usado por `DashboardLayout`) |
| `shared/components/dashboard/DashboardPage.tsx` | `features/dashboard/pages/DashboardPage.tsx` (la que está en `AppRouter`) |
| `shared/components/dashboard/StatCard.tsx` (vacío) | `features/dashboard/components/StatsCard.tsx` (nombre casi idéntico, confunde) |

**Acción sugerida:** borrar la columna izquierda.

## Mismo concepto implementado dos veces, ninguna conectada todavía

- `EmptyState`: existe vacío en `common/EmptyState.tsx` y con código real en `empty-state/EmptyState.tsx`. Ninguno se importa desde ningún lado hoy.
- Loading: `common/Loading.tsx` (vacío) vs `loading/LoadingSpinner.tsx` (con código). Tampoco se usa ninguno.

**Acción sugerida:** elegir una ubicación única por concepto, borrar la otra, y conectar donde corresponda (ej. `DataTable` durante `isLoading`, páginas con fetch).

## Barrels incompletos / sin usar

- `shared/components/form/index.ts` solo reexporta `FormSection` y `FormActions`. No incluye `TextField`, `PasswordField`, `SubmitButton`, `SearchInput`. Y tres archivos que debería cubrir están vacíos: `CheckboxField.tsx`, `SelectField.tsx`, `TextAreaField.tsx`.
- `shared/components/entity/index.ts` reexporta bien sus 3 componentes (`EntitySheet`, `EntitySheetHeader`, `EntitySheetFooter`), pero nada en la app los importa todavía — probablemente para un futuro drawer de detalle de Job/Candidate.
- `shared/components/data-table/`: `DataTableColumnHeader.tsx`, `DataTablePagination.tsx`, `DataTableToolbar.tsx`, `Types.ts` están vacíos — sorting/paginación/toolbar del `DataTable` aún no se construyeron.

**Acción sugerida:** o se completan estos archivos, o se borran si ya no están en el plan.

## Notas
- El build de TypeScript (`tsc -b --force`) está limpio a la fecha de este documento — nada de lo listado aquí rompe la compilación, es puramente limpieza de arquitectura/duplicados.

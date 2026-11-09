# Frontend — deuda técnica vigente (revisión 2026-11-06)

> Reescrito tras los Bloques 1 y 2 (2026-11-02). El documento original (2026-07-23)
> listaba archivos vacíos y duplicados que ya fueron eliminados o conectados —
> ver "Resuelto" abajo. Esto es lo que **sigue pendiente**, verificado contra el
> código actual.

## Resuelto (no acción requerida)

| Hallazgo original (2026-07-23) | Estado |
|---|---|
| Archivos vacíos/huérfanos en `shared/components` (Logo, Navbar, Sidebar, dashboard/*, common/*) | ✅ Eliminados en Bloque 1 (18 archivos + carpeta `@/` del CLI de shadcn) |
| `EmptyState` duplicado (vacío vs `empty-state/`) | ✅ El vacío eliminado; el real conectado al `DataTable` (prop `emptyTitle`/`emptyDescription`) en Bloque 2 |
| `Loading` vs `LoadingSpinner` sin uso | ✅ El vacío eliminado; `LoadingSpinner` conectado al `DataTable` (prop `isLoading`) en Bloque 2 |
| `data-table/` con archivos "vacíos" | ✅ Aclaración: nunca estuvieron vacíos (2.6–7.3 KB); la feature está construida y conectada |
| 5 clientes Axios copiados | ✅ Unificados en `createApiClient` (`shared/api/httpClient.ts`) con interceptores JWT + 401-logout |
| `UiShowcasePage` en rutas de producción | ✅ Ruta dev-only (`import.meta.env.DEV`) + lazy, fuera del bundle de prod |

## Pendiente (verificado 2026-11-06)

### Media prioridad

1. **Barrels incompletos** — `shared/components/form/index.ts` solo reexporta
   `FormSection` y `FormActions`; `TextField`, `PasswordField`, `SubmitButton` y
   `SearchInput` existen pero no se reexportan (se importan por ruta larga).
   Decisión pendiente: completar el barrel o eliminarlo (import explícito).
2. **`shared/components/entity/` sin uso** — `EntitySheet`, `EntitySheetHeader`,
   `EntitySheetFooter` con barrel completo pero ningún consumidor. Era para un
   futuro drawer de detalle de Job/Candidate: o se usa en esa feature, o se borra.
3. **`shadcn` como dependencia runtime** en `package.json` — es una CLI de
   desarrollo; debería ser devDependency (o invocarse vía `npx`).

### Baja prioridad

4. **Lint/formato**: oxlint con solo 2 reglas activas (`rules-of-hooks`,
   `only-export-components`) y sin reglas type-aware; no hay Prettier ni script
   `format`. Scripts `typecheck`/`format` y `engines.node` en `package.json`
   tampoco existen.
5. **`shared/services/SessionService.currentUserId()`** decodifica el JWT a mano —
   sigue siendo válido, pero desde el Bloque 2 el backend ya devuelve el usuario
   en el login; candidato a simplificar (usar `currentUser()` del store).
6. **Tests**: cero cobertura automatizada (ver sesión de tests 2026-11-06 en
   `docs/sessions/` — piloto en curso).
7. **Bundle de 1.3 MB** (warning de Vite): code-splitting por ruta
   (`React.lazy` en `AppRouter`) cuando haga falta optimizar.
8. **`src/shared/components/PlaceholderSection.tsx`** usa `EmptyState` correctamente
   pero conviene verificar si sigue referenciado por alguna página; si no, borrarlo.

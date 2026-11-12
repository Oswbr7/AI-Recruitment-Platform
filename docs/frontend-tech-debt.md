# Frontend — deuda técnica vigente (revisión 2026-11-06, batería aplicada)

> Reescrito tras los Bloques 1 y 2 (2026-11-02). El documento original (2026-07-23)
> listaba archivos vacíos y duplicados que ya fueron eliminados o conectados —
> ver "Resuelto" abajo. Segunda pasada 2026-11-06 (batería de deuda): se
> corrigieron entradas falsas y se resolvieron los items mecánicos.

## Resuelto (no acción requerida)

| Hallazgo original | Estado |
|---|---|
| Archivos vacíos/huérfanos en `shared/components` | ✅ Eliminados en Bloque 1 (18 archivos + carpeta `@/`) |
| `EmptyState`/`Loading` duplicados sin uso | ✅ Conectados al `DataTable` en Bloque 2 |
| 5 clientes Axios copiados | ✅ Unificados en `createApiClient` (Bloque 2) |
| `UiShowcasePage` en rutas de producción | ✅ Dev-only + lazy (Bloque 2) |
| `shadcn` como dependencia runtime | ✅ Movido a devDependencies (batería 2026-11-06) |
| Sin script `typecheck` / `engines.node` | ✅ `"typecheck": "tsc -b"` + `engines.node >= 24` (batería) |
| Password registro min 6 (backend 8... inversa) | ✅ Alineado a **min 8 en ambos lados** (batería) |
| `Sidebar.menu` legacy duplicado sin uso | ✅ Export eliminado; el menú real es `shared/constants/navigation.ts` (batería) |
| Sin Prettier / script `format` | ✅ Prettier instalado (`.prettierrc`: tabWidth 4, doble quote, printWidth 100), `.prettierignore` excluye `src/components/ui` (shadcn generado), scripts `format`/`format:check` + gate en CI (2026-11-06) |

## Corrección de entradas falsas (batería 2026-11-06)

- ~~`ExistsByTaxIdAsync` sin uso~~ — **falso positivo**: lo consumen
  `CreateCompanyValidator` y `UpdateCompanyValidator` (validación FluentValidation,
  arquitectura correcta). Se retira de la deuda.

## Pendiente (verificado 2026-11-06)

### Media prioridad

1. **Barrels incompletos** — `shared/components/form/index.ts` solo reexporta
   `FormSection` y `FormActions`; `TextField`, `PasswordField`, `SubmitButton` y
   `SearchInput` existen pero no se reexportan. Decisión pendiente: completar el
   barrel o eliminarlo (import explícito).
2. **`shared/components/entity/` sin uso** — `EntitySheet`, `EntitySheetHeader`,
   `EntitySheetFooter` con barrel completo pero ningún consumidor. Era para un
   futuro drawer de detalle: o se usa en esa feature, o se borra.

### Baja prioridad

4. **oxlint** con solo 2 reglas activas (`rules-of-hooks`,
   `only-export-components`) y sin reglas type-aware — subir a type-aware como
   mejora separada (Prettier ya cubre el formato).
5. **`shared/services/SessionService.currentUserId()`** decodifica el JWT a mano —
   sigue siendo válido, pero desde el Bloque 2 el backend ya devuelve el usuario
   en el login; candidato a simplificar.
6. **Tests de componentes** — Testing Library para `DataTable` (isLoading/empty),
   `ProtectedRoute` (guards de rol), formularios. 22 tests hoy, todos de lógica pura.
7. **Bundle de 1.3 MB** (warning de Vite): code-splitting por ruta
   (`React.lazy` en `AppRouter`) cuando haga falta optimizar.
8. **`PlaceholderSection.tsx`** — **intencional**: secciones "coming soon" en
   vistas de detalle (Skills/Experience/Education del candidato, Recruiters de
   empresa). No es deuda; es roadmap visible. Volverá a evaluarse cuando existan
   esas features.

### Backend relacionado (para no perder el hilo)

9. **CS8618** (nullable props en entidades de dominio) — 13 warnings pendientes
   en job/candidate/company/interview. Mecánico pero toca 4 dominios: sesión
   dedicada (`required` o inicialización en factories).

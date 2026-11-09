# Aprendizaje — Por qué hicimos esta organización documental (Bloque 🔵, 2026-11-06)

> Documento educativo complementario a `docs/sessions/2026-11-06-organizacion-bloque-documental.md`.
> Conceptos: documentación como liabilities, el rename como refactor de consistencia, y la diferencia entre historia y estado.

---

## 1. La documentación envejece: el caso `Notas.md`

`Notas.md` era un archivo de notas personales con tres tipos de contenido: conceptos de arquitectura (Clean Architecture, CQRS, Result Pattern), ejemplos curl de la API, y una lección sobre CI. Al decidir su futuro se aplicó la misma disciplina de la sesión de limpieza (Bloque 1): **cada pieza se clasificó por su relación con la realidad actual**:

- **Conceptos** → ya viven en `docs/learn/` (documentos educativos que explican el *por qué* con el contexto de las decisiones reales).
- **Lección de CI** → ya aplicada en código (`ci.yml` con path filters). Una nota que describe lo que el pipeline ya hace es redundancia.
- **Ejemplos curl** → **falsos**: decían que register devuelve un Guid plano, pero el Bloque 2 lo cambió a envelope. Esto es lo crítico: *un documento que contradice el código es peor que la ausencia de documento*, porque enseña el uso incorrecto de la API a quien llegue nuevo (humano o IA).

**Lección**: los documentos son *liabilities* que hay que mantener, no assets que acumular. La prueba de fuego no es "¿contiene información?" sino "¿sigue siendo verdad hoy y hay un mecanismo que lo mantenga verdadero?". Los worklogs por sesión son ese mecanismo: cada sesión deja constancia, y los docs de estado (`architecture.md`) se actualizan al final de cada una.

## 2. El rename: `Infraestructure/` → `infrastructure/`

Una carpeta mal escrita ("Infraestructure" con E mayúscula, heredada de los primeros commits) parece cosmético, pero tiene costos reales:

1. **Fricción constante**: quien escribe un comando (humano o IA) debe recordar la grafía errada o fallar. Los errores de "path no encontrado" por typos de este tipo son de los más comunes en este repo.
2. **Propagación**: cada documento nuevo que la referencia hereda el error. A las 29 ocurrencias de hoy se sumarían más cada mes.
3. **Señal de calidad**: en un proyecto de aprendizaje cuyo propósito es enseñar buenas prácticas, la inconsistencia ortográfica en rutas enseña que "da igual", que es lo contrario de la disciplina que el resto del repo predica.

Mecánica que lo hace seguro:

- **`git mv`** en lugar de borrar+crear: git sigue el archivo como renombrado y preserva `git log`/`git blame` a través del cambio.
- **Actualizar referencias vivas, no historia**: los worklogs de sesiones pasadas (`docs/sessions/*`) mencionan la ruta vieja *en el momento en que era correcta*. Reescribirlos falsificaría el registro histórico. La regla: los documentos de **estado** (architecture.md, AGENTS.md, READMEs) reflejan el presente; los documentos de **historia** (sessions, learn) son inmutables como un log de commits.
- **Verificación por grep + builds**: tras el rename, grep residual confirmó que solo queda en históricos, y los builds/compose/kustomize validaron que ninguna ruta viva quedó rota.

**Lección**: los renames baratos hechos pronto son triviales; los mismos renames pospuestos meses (cuando hay cientos de referencias y herramientas externas configuradas) son proyectos de riesgo. El mejor momento para corregir una inconsistencia es cuando la descubres.

## 3. Reescribir el tech-debt: la deuda también caduca

`docs/frontend-tech-debt.md` original listaba ~17 archivos vacíos y duplicados. Cuando se revisó contra el código real (sesiones Bloque 1 y 2): **todo lo listado como pendiente ya estaba resuelto o era incorrecto** (los archivos de `data-table/` nunca estuvieron vacíos — el hallazgo original era un falso positivo de la auditoría).

Un documento de deuda que describe problemas inexistentes tiene el efecto contrario al deseado:

- Hace perder tiempo a quien intenta "resolver" lo resuelto.
- Desacredita el documento: si la mitad es falso, la otra mitad tampoco se confía.
- Oculta la deuda real: la atención se va a los fantasmas y no a lo que sí duele (barrels incompletos, componentes sin uso, cero tests).

**Lección**: la deuda técnica es un inventario que caduca. Revisarla por sesión (y marcar con trazabilidad qué se resolvió y en qué sesión) mantiene el documento como herramienta de priorización y no como museo de problemas muertos.

## 4. El hilo conductor

| Concepto | Dónde se vio |
|---|---|
| Los docs son liabilities: mantener o eliminar | `Notas.md` eliminado (contenido migrado o falso) |
| Doc falso es peor que doc ausente | Ejemplos curl contradiciendo el contrato real |
| Rename seguro = `git mv` + actualizar vivos + respetar historia | `Infraestructure/` → `infrastructure/` |
| Historia vs estado: los worklogs no se reescriben | Referencias residuales solo en `docs/sessions/*` |
| La deuda caduca: inventario con fecha y trazabilidad | `frontend-tech-debt.md` reescrito con sección "Resuelto" |

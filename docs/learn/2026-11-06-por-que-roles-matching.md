# Aprendizaje — Por qué roles y matching se construyeron así (2026-11-06)

> Documento educativo complementario a `docs/sessions/2026-11-06-roles-matching.md`.
> Conceptos: auto-elevación vs. arranque self-hosted, autorización basada en claims, scoring explicable vs. caja negra, y la agregación en cliente como decisión de arquitectura.

---

## 1. Roles: por qué "primer usuario = Admin" y no "elige tu rol al registrarte"

El hueco original era sencillo de cerrar mal: añadir `role` al body del registro. Eso habría creado una **vulnerabilidad de auto-elevación**: cualquiera se registra como Admin y la autorización por roles muere en su nacimiento. Las alternativas reales son pocas:

| Opción | Problema |
|---|---|
| Rol libre en el registro | Auto-elevación — inviable |
| Flag de configuración "modo bootstrap" | Estado extra que olvidas apagar |
| **Primer usuario = Admin** ✅ | Regla pura de dominio: base vacía → el primero es admin. Sin flags, sin config, sin superficie de ataque nueva |

La regla tiene además una propiedad elegante: **se auto-neutraliza**. Después del primer registro, la condición `Count == 0` nunca vuelve a ser verdadera en esa base de datos. No hay "modo especial" que apagar porque no es un modo: es un hecho histórico.

Y el resto del modelo: los siguientes usuarios nacen Candidate, y **solo un Admin puede promover** (`PATCH /api/users/{id}/role` con `RequireRole("Admin")`). La cadena de confianza es completa: el primer Admin nace de la vacuidad, los demás roles nacen de un Admin. Es el mismo patrón del superusuario en sistemas operativos (`root` existe antes que cualquier cuenta).

**Lección**: cuando un requisito es "alguien tiene que ser el primero", la solución más segura suele ser una regla derivable del estado (base vacía), no un mecanismo configurable.

## 2. El claim `role` existía desde el Epic-001 — por qué tardó en usarse

El JWT lleva el claim `role` desde el servicio de login original, y `RequireAuthorization()` se usaba en todos los endpoints desde el Epic-006. Pero **autenticación ≠ autorización**: saber *quién eres* no es decidir *qué puedes hacer*. La primera autorización por roles del proyecto (`RequireRole("Admin")`) llegó esta sesión — y funcionó a la primera porque la infraestructura (claim en el token, mapeo inbound de JwtBearer, policy-based authorization) ya estaba bien puesta años de refactor encima.

Es un patrón recurrente en este repo: las sesiones de infraestructura (Bloque 1-2, Fases 0-2) **preparan capacidades que las features de producto consumen después sin fricción**. El guard `ProtectedRoute roles=[...]` del frontend es el espejo exacto del `RequireRole` del backend — mismos strings de rol, mismos redirects — porque ambos leen el mismo claim.

## 3. Matching: por qué determinístico y explicable antes que LLM

El nombre del producto promete IA, y la presión de "usar IA" es real. Pero la decisión de empezar con un scoring determinístico responde a tres argumentos:

1. **Auditable**: cada punto es atribuible a una dimensión (`location 25, experience 25, salary 20, pipeline 15, keywords 15`). Cuando un reclutador pregunta "¿por qué María va primero?", la respuesta es el desglose, no "el modelo así lo decidió". En reclutamiento —donde las decisiones tienen consecuencias legales y éticas— la explicabilidad no es un lujo.
2. **Testeable**: 8 tests cubren las reglas incluidos los neutrales (dato ausente ≠ penalización). Un LLM no se testea así: se evalúa con datasets y umbrales de calidad, infraestructura que este proyecto aún no tiene.
3. **Migrable**: la función `scoreCandidate(job, candidate)` es pura y vive aislada en `scoring.ts`. Cuando el matching requiera señales que el cliente no tiene (parsing de CV, embeddings de skills), su lugar natural es un matching-service backend — y la firma de la función no cambia. El determinístico se convierte en baseline contra el que medir cualquier versión con IA.

**Lección**: "explicable primero" no es anti-IA; es la secuencia correcta. Sin baseline determinístico no sabrás si tu modelo de IA mejora nada.

## 4. Por qué el matching vive en el cliente (y cuándo dejará de hacerlo)

La decisión de agregar en el navegador reutiliza tres activos que ya existían: los endpoints paginados de jobs y candidates, las query keys centralizadas de TanStack Query, y el patrón documentado del Dashboard. El costo marginal fue casi cero y el cache se comparte con las páginas que ya consultan esos datos.

El límite está claramente marcado: **cuando el scoring necesite datos a los que el cliente no puede llegar**. Hoy usa solo campos del modelo `Candidate` y `Job`; mañana, con skills estructuradas, historial de entrevistas o CVs parseados, el backend (o un matching-service) será el lugar natural — y los criterios de la migración ya están escritos en el worklog.

**Lección**: "¿frontend o backend?" no se responde con ideología sino con una pregunta concreta: *¿todos los datos que necesita el cálculo ya llegan al cliente?* Si sí, el cliente es más barato y más reactivo; si no, el backend es inevitable.

## 5. Detalles que parecen pequeños y no lo son

- **Neutral ≠ penalizar**: datos ausentes puntúan 10/25, no 0. Penalizar lo que el candidato no declaró introduce sesgo contra perfiles incompletos — y castiga al reclutador con peores rankings por culpa de datos, no de fit.
- **Pipeline como señal**: un candidato en `Offer` puntúa menos que uno `Applied` para una vacante nueva — no porque sea peor profesional, sino porque probabilísticamente está menos disponible. Es la primera señal del dominio (no del texto) que entra al scoring.
- **El compilador como red de regresión de contratos**: al añadir `role` a `User`, `tsc` rompió los fixtures de `httpClient.test.ts` — exactamente lo que debe pasar cuando cambia un contrato compartido. Arreglar el test fue validar el cambio, no una molestia.

## 6. Resumen de conceptos

| Concepto | Dónde se vio |
|---|---|
| Arranque self-hosted: primera cuenta = admin derivada del estado | `RegisterUserHandler` con `Count == 0` |
| Autenticación vs. autorización; primer consumidor de `RequireRole` | `PATCH /api/users/{id}/role` |
| Cadena de confianza de roles | vacuidad → Admin → promueve Recruiters |
| Scoring explicable como baseline de cualquier IA futura | `scoring.ts` + desglose por dimensión |
| Dato ausente = neutral, nunca penalizar | experiencia/salario/keywords sin datos |
| Agregación en cliente mientras el cálculo solo necesite datos disponibles | `useJobMatches` con query keys compartidas |
| El typecheck como red de regresión de contratos | fixtures rotos al añadir `User.role` |

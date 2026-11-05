# Aprendizaje — Por qué hicimos los puntos 6, 7 y 8 (Bloque 2, 2026-11-02)

> Documento educativo complementario a `docs/sessions/2026-11-02-consistencia-bloque-2.md`.
> Tres refactors aparentemente distintos (un controller MVC, 5 clientes HTTP copiados, componentes compartidos muertos) que responden a **un mismo principio**: *en una plataforma, lo común debe vivir en un solo lugar, y lo excepcional debe ser una decisión explícita, no un accidente histórico.*

---

## Punto 6 — auth-service: eliminar el outlier estructural

### El problema: la "excepción provisional" que se volvió permanente

`auth-service` era el único servicio con un controller MVC. La excusa histórica era prudente: "no tocar el flujo de login". Pero fíjate en lo que esa excepción arrastró durante epics enteros:

- **Dos `Result` propios** (uno en Api, otro en Application) que duplicaban los de `BuildingBlocks` — uno de ellos *byte a byte idéntico*.
- Un `Response.cs` en Login y otro en Register que **nadie usaba** (código muerto escrito "para cuando se complete el feature").
- Un contrato de login que devolvía `{accessToken}` mientras el frontend esperaba `{accessToken, expiresAt, user}` — el usuario quedaba `undefined` en el store y la UI lo mostraba en blanco. El frontend "sobrevivía" decodificando el JWT a mano.
- Cambios de plataforma hechos dos veces: cada mejora de BuildingBlocks (envelope, ProblemDetails, validación) llegaba a 4 servicios automáticamente y al quinto... nunca.

**Lección**: una excepción "temporal por seguridad" sin ticket de deuda asociado es deuda eterna. La seguridad real no viene de no tocar el código, sino de *entenderlo lo suficiente para replicarlo* y de *verificarlo después* (build + smoke test).

### La migración: mismo patrón, mismo pipeline, mismas garantías

El controller hacía tres cosas: recibir el body, mandar el MediatR, traducir `Result` a HTTP. El endpoint Minimal API hace exactamente lo mismo:

```
Controller MVC:                        Minimal API (IEndpoint):
[HttpPost("login")]                    app.MapPost("/api/auth/login", Handle)
  → mediator.Send(command)               → sender.Send(command)
  → if (!IsSuccess) Unauthorized         → if (IsFailure) 401
  → Ok(new { accessToken })              → Ok(result.Value)
```

La diferencia no es cosmética: el endpoint nuevo vive en el **mismo pipeline** que el resto de la plataforma (mismo `Program.cs`, mismos behaviors de MediatR, mismo `GlobalExceptionHandler`, mismo registro por reflexión vía `IEndpoint`). La validación de FluentValidation, el logging y el manejo de excepciones no tuvieron que reimplementarse — ya estaban ahí.

### Los Result: dos conceptos distintos que conviene no confundir

Esta plataforma tiene **dos** tipos llamados `Result`, y la sesión los puso cada uno en su lugar:

| | `Common.Errors.Result<T>` | `Common.Http.Result<T>` |
|---|---|---|
| **Qué responde** | "¿la operación de dominio tuvo éxito?" | "¿cómo se ve el cuerpo del HTTP response?" |
| **Dónde vive** | Application (handlers) | Api (endpoints) |
| **Error** | `Error` tipado (Code, Description, ErrorType) | `string` de mensaje |
| **Uso en auth tras la sesión** | Login/register handlers | Envelope de errores de los endpoints |

El `Result` viejo de Application usaba `string` para errores (`"Invalid credentials"`); la monada de BuildingBlocks usa `Error` con `ErrorType` — que es lo que permitió devolver **409 Conflict** para "email ya existe" en vez del 400 genérico de antes: el tipo de error del dominio se mapea a semántica HTTP. Eso es imposible con strings sueltos.

### La dirección de las dependencias: por qué movimos `UserErrors`

`UserErrors` (InvalidCredentials, EmailAlreadyExists...) estaba físicamente en el proyecto **Api** aunque su namespace decía `AuthService.Application.Common.Errors`. Los handlers (proyecto Application) no podían usarlo: Application no referencia a Api (sería invertir la regla de Clean Architecture — "las dependencias apuntan hacia el centro"). Estaba en el lugar equivocado y por eso estaba **muerto**: nadie podía usarlo legítimamente. Moverlo a Application no es un truco de carpetas, es respetar la dirección de las dependencias para que el código compartido sea usable.

### El contrato de login: cerrar el gap dejó de ser opcional

El backend devolvía `{accessToken}`; el tipo `LoginResponse` del frontend declara `expiresAt` y `user`. TypeScript no se quejaba porque el tipo *declaraba* algo que la red nunca enviaba — la falsedad estaba en el borde entre sistemas, donde el compilador no llega. La corrección requirió que el backend *produjera* lo que el frontend *declaraba*:

- `IJwtProvider.Generate(User)` pasó de devolver `string` a devolver `GeneratedToken(AccessToken, ExpiresAt)` — la duración del token (8h) se define **una sola vez** en `JwtProvider` y viaja con el token, en vez de recomputarse o duplicarse en el handler.
- El handler construye `UserSummary(Id, FullName, Email)` desde la entidad que ya cargó para validar credenciales — sin queries extra.

**Lección**: un tipo TypeScript no es un contrato garantizado; lo es cuando el backend, el DTO y el tipo del frontend fueron escritos mirándose entre sí. Ahí el compilador sí protege: `tsc` ahora valida que `AuthApplicationService` usa exactamente los campos que el backend envía.

### Detalle real encontrado: `Results.Unauthorized()` no acepta cuerpo

En .NET 10, `Results.Unauthorized()` existe sin parámetros. Para devolver 401 con el envelope de error se usa `Results.Json(cuerpo, statusCode: 401)`. Es el tipo de detalle que solo se descubre compilando — otra razón de que "compilar todo después de cambiar" sea innegociable.

---

## Punto 7 — clientes Axios: de 5 copias a una factory

### El problema con el copy-paste transversal

Los 5 clientes eran idénticos salvo `baseURL`. Eso parece inofensivo hasta que necesitas cambiar la lógica transversal — y la lógica transversal HTTP **siempre** cambia: adjuntar token, manejar expiración, reintentos, correlación, errores. Con 5 copias, cada mejora es un ejercicio de "¿los 5 quedaron igual? ¿el del servicio nuevo que se agregue mañana va a nacer con la lógica vieja?"

Además ya habían divergido en algo peor que el código: **en formato** (comillas, estilo). La divergencia cosmética es la primera señal de que los archivos se editan por separado, es decir, que no son "el mismo concepto" para quien los mantiene.

### El patrón: factory + instancias configuradas

```
createApiClient(baseURL)  ← TODA la lógica transversal vive aquí, una vez
    ├── interceptor request:  JWT Bearer desde el authStore
    └── interceptor response: 401 → logout local; resto → propagar

apiClient.ts      → export const api          = createApiClient(VITE_API_URL)
jobsApiClient.ts  → export const jobsApi      = createApiClient(VITE_JOBS_API_URL)
... (3 más)
```

Puntos deliberados de la decisión:

1. **Se conservan los 5 archivos y nombres de export** (`api`, `jobsApi`, ...). La razón es puramente de diseño: una URL base por microservicio sigue siendo realidad arquitectónica (no hay API Gateway todavía — eso es decisión del bloque 🟢). Lo que se elimina es la **lógica duplicada**, no las instancias. Cero archivos de consumidores tocados: el refactor se valida entero compilando.
2. **El 401-auto-logout es comportamiento nuevo y es la razón de ser del interceptor response**: un token expirado hacía que todas las peticiones fallaran silenciosamente con el token caducado guardado. Ahora cualquier servicio que responda 401 limpia la sesión y `ProtectedRoute` redirige al login. Nota el diseño: **solo el 401 se trata aquí**; cualquier otro error se propaga sin tocar, porque el manejo de errores de negocio (mensajes, reintentos, toasts) pertenece a React Query y a la UI — el interceptor no debe usurparlo.
3. **La factory toma `baseURL`, no la env**: leer `import.meta.env` queda en los archivos de instancia. Así la factory es testeable y reusable fuera de Vite.

**Lección general**: "unificar" no siempre significa "un solo objeto global". Significa *una sola definición de la lógica común*. Las instancias configuradas (una por servicio) son la forma correcta de tener lo mejor de los dos mundos.

---

## Punto 8 — componentes compartidos: del cajón a la app

### El anti-patrón: la librería de componentes que nadie usa

`EmptyState` y `LoadingSpinner` existían, estaban bien hechos... y ningún componente los importaba. El `DataTable` — el candidato natural número 1 para ambos — mostraba un `"No results."` hardcodeado y ningún estado de carga. Esto es muy común y muy instructivo:

- Un componente compartido **no compartido** es un *costo sin beneficio*: hay que mantenerlo, documentarlo, y confunde a quien no sabe cuál de los dos `EmptyState` usar (esa confusión literalmente existía: dos implementaciones del mismo concepto).
- El momento de "conectarlo" nunca llega solo: tiene que ser una decisión. Por eso esta sesión lo hizo explícitamente.

### El cambio: estados como props opt-in

El `DataTable` ganó tres props opcionales: `isLoading`, `emptyTitle`, `emptyDescription`. Decisiones de diseño:

1. **Opt-in, no breaking**: ninguna de las páginas existentes dejó de compilar ni cambió de comportamiento — la prop se adoptará donde se necesite, página por página. Un refactor de consistencia no debe exigir tocar 15 archivos de features ajenas a la sesión.
2. **Los textos por defecto viven en el componente** (`"No results"` / `"No records found."`), no se exigen desde fuera — la mayoría de las tablas quiere exactamente eso; las que quieran otro copy lo pasan.
3. **Se reutilizó lo que ya existía** en vez de crear un tercer componente de "tabla vacía": `EmptyState` (con su icono `SearchX` y estilos) ya era el lenguaje visual de la app en las 15 vistas que sí lo usaban.

### UiShowcasePage: herramienta interna fuera de producción

La página `/ui` era un catálogo de componentes — útil en desarrollo, pero estaba cableada como ruta normal de producción. La decisión no fue borrarla (sigue siendo útil para el propósito de aprendizaje del proyecto) sino **acotarla al entorno donde tiene sentido**:

```tsx
const UiShowcasePage = lazy(() => import('@/features/ui/pages/UiShowcasePage')...)

{import.meta.env.DEV && (
    <Route path="/ui" element={<Suspense ...><UiShowcasePage /></Suspense>} />
)}
```

Tres conceptos en cinco líneas:

- **`import.meta.env.DEV`**: Vite lo reemplaza estáticamente (`true`/`false`) al compilar — en producción la ruta simplemente no existe, no es un chequeo de runtime que se pueda evitar.
- **`React.lazy` + `Suspense`**: el showcase se compila en su propio chunk y **solo se descarga si la ruta se renderiza**. Verificado en el build real: `UiShowcasePage-*.js` (1.7 KB) sale separado del bundle principal (1.3 MB).
- **Costo cero en prod, utilidad intacta en dev**: decisiones de este tipo (gating por entorno) son la alternativa correcta a "borrar vs. mantener" cuando algo es herramienta interna.

**Lección**: "consistencia" no es solo homogeneizar código — también es *que cada pieza viva en el entorno que le corresponde*.

---

## El hilo conductor de los tres puntos

| Punto | Síntoma | Principio aplicado |
|---|---|---|
| 6 | Un servicio distinto a los otros 4 | Lo común se define una vez (BuildingBlocks); las excepciones deben justificarse, no heredarse |
| 7 | 5 copias de la misma lógica | Lógica transversal = un solo punto de cambio (factory + interceptores) |
| 8 | Componentes compartidos sin uso / ruta interna en prod | Lo que existe debe estar conectado o acotado; nada en un estado intermedio "por si acaso" |

Y la verificación de los tres fue la misma disciplina del Bloque 1: **grep/lectura antes de tocar, build de todo después, y la verificación que no se pudo hacer (smoke test de runtime sin Docker) quedó registrada como pendiente explícito en vez de asumirse.**
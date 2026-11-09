# Aprendizaje — Por qué empezamos los tests aquí (2026-11-06)

> Documento educativo complementario a `docs/sessions/2026-11-06-tests-piloto-ci.md`.
> Conceptos: la pirámide aplicada a esta arquitectura, dónde está el ROI de los tests, mocks vs. fakes, y por qué los tests de contrato son los más valiosos de este repo.

---

## 1. Por qué handlers CQRS y mappers: la frontera es donde mueren los bugs

La tentación al empezar a testear es ir por lo visible: páginas completas, endpoints de punta a punta, flujos E2E. Pero mira dónde nacieron los bugs reales de este proyecto:

| Bug real | Dónde vivía | ¿Lo atraparía un test de...? |
|---|---|---|
| Login devolvía `{accessToken}` y el frontend esperaba `{accessToken, expiresAt, user}` | La lógica del `LoginHandler` + el mapeo a `LoginResponse` | **Unit test del handler** ✅ |
| `EmptyState`/`LoadingSpinner` existían pero ningún componente los usaba | Conexión componente↔consumidor | Test de componente (vino después) |
| El interceptor 401 no limpiaba la sesión | La **lógica del interceptor** | **Unit test del factory** ✅ |
| `null` del DTO rompía tipos del modelo (salarios opcionales) | **El mapper** | **Unit test del mapper** ✅ |
| Query keys mal anidadas → invalidaciones que no invalidan | **Las claves de query** | **Unit test de queryKeys** ✅ |

El patrón es claro: **los bugs viven en las fronteras de conversión** — DTO↔modelo, dominio↔HTTP, request↔respuesta. Esas fronteras en esta arquitectura son funciones puras (mappers, handlers con dependencias inyectadas, factories de cliente) y son lo más barato de testear con el mayor retorno. Las vistas E2E son caras de escribir, frágiles de mantener y hubieran atrapado exactamente cero de los cinco bugs de arriba.

**Lección**: "¿dónde pongo los primeros tests?" se responde con "¿dónde están los bugs que ya padecí?", no con "¿qué es más fácil de demostrar?".

## 2. El trato que la arquitectura te ofrece: testabilidad como subproducto

Los tests del `LoginHandler` no requieren base de datos, ni ASP.NET, ni contenedores:

```csharp
new LoginHandler(Mock.Of<IUserRepository>(...), Mock.Of<IPasswordHasher>(...), Mock.Of<IJwtProvider>(...))
```

Esto no es suerte: es el resultado acumulado de decisiones de arquitectura anteriores — inyección de dependencias por constructor, abstracciones (`IJwtProvider`, `IUserRepository`) en lugar de clases concretas, handlers sin estado, lógica de dominio separada de infraestructura. El test es la **prueba de que la arquitectura cumplió su promesa**: si hubiera sido doloroso escribir estos tests (necesitar EF InMemory, montar la API, tocar la base real), la conclusión correcta no habría sido "los tests son caros" sino "el diseño acopla lo que no debe".

Por eso el proyecto de tests referencia **solo `AuthService.Application`**: es una afirmación verificable de que la capa Application no depende de Api ni Infrastructure. C# lo comprueba en cada build; el test lo hace evidente.

**Lección**: los tests unitarios baratos son el termómetro de la calidad arquitectónica. Si unit-testear duele, el problema es de diseño, no de testing.

## 3. Mocks vs fakes: qué se verifica en cada test

Con Moq hay dos verbos distintos y conviene no mezclarlos sin propósito:

- **`Setup` + asserts sobre el resultado**: "dado X, el handler devuelve Y" — prueba la lógica.
- **`Verify` (comportamiento)**: "el JWT **jamás** se genera si las credenciales fallan", "SaveChanges se llama **exactamente una vez**" — prueba el *protocolo* con las colaboraciones.

Los `Times.Never`/`Times.Once` del piloto no son detalles: expresan reglas de la arquitectura. Que el registro duplicado no toque `SaveChanges` protege la regla "UnitOfWork es el único que confirma (una vez)". Que el login fallido no genere token protege la cuenta regresiva de ataques (no hay señal de qué falló, ni token parcial).

Un fake manual hubiera sido igual de válido (y más didáctico en algunos sentidos); Moq se eligió por economía de Setup/Verify. La lección portable no es la librería, sino **verificar el comportamiento que la arquitectura promete**, no solo el valor de retorno.

## 4. El test del interceptor: unit-testear lo que parecía de integración

El interceptor 401→logout parece intrínsecamente de integración (involucra axios, el store, la red). Pero la técnica aplicada lo reduce a pura unidad:

1. `vi.mock("axios")` — el módulo axios es reemplazado por un mock; `axios.create` devuelve un objeto falso.
2. El falso **captura** los handlers registrados (`interceptors.request.use(fn)` → guardo `fn`).
3. Se invocan los handlers directamente con una config/errores fabricados.

Resultado: se prueba la **lógica del interceptor** (¿adjunta Bearer? ¿hace logout solo en 401? ¿propaga el resto?) sin red, sin servidor, sin react. El store de zustand es real porque es gratis (jsdom da localStorage al middleware persist) y así el test también ejerce el contrato store↔interceptor.

**Lección**: "¿unit o integración?" no lo decide el tema (HTTP, base de datos) sino **qué colaborador cuesta más reemplazar**. Axios se reemplaza con una línea; el store real cuesta cero. La frontera del test la pones donde el costo de aislar supera el valor de usar lo real.

## 5. Tests de contrato: la mejor defensa contra la regresión del Bloque 2

El test más estratégico del piloto es este:

```csharp
Assert.Equal("token-jwt", result.Value.AccessToken);
Assert.Equal(expiresAt, result.Value.ExpiresAt);
Assert.Equal("Juan Pérez", result.Value.User.FullName);
```

No prueba lógica compleja — prueba el **contrato** que el frontend consume (`LoginResponse.ts`). Su valor: si alguien refactoriza `LoginHandler`/`LoginResponse` y rompe el shape que el frontend espera (exactamente lo que pasó antes del Bloque 2, cuando el contrato vivía solo en la memoria de dos sistemas), este test falla en el build, no en producción.

El `jobMapper.test.ts` hace lo mismo en la otra frontera: `null` del DTO → `undefined` del modelo. Son reglas de conversión que nadie escribió en ningún documento y que solo existían implícitamente en el código. El test las convierte en **especificación ejecutable**.

**Lección**: prioriza tests que documentan reglas invisibles (contratos, conversiones, invariantes) sobre tests que repiten lo obvio (un getter devuelve lo que seteaste). Los primeros se pagan solos; los segundos son ruido.

## 6. El CI como consecuencia, no como meta

Reactivar `dotnet test` y agregar `npm run test` al CI no fue la "meta" de la sesión — fue la **consecuencia** de tener tests que valen la pena. El TODO que se eliminó llevaba meses esperando exactamente esto: pasos de pipeline sin contenido real son falsos positivos (lección de la Fase 0), y ahora el gate existe porque hay 15 aserciones detrás que lo justifican.

El orden importó: primero tests útiles en local, verdes, y recién entonces el gate. Al revés (activar el paso con tests de relleno) habría creado la ilusión de calidad que la Fase 0 eliminó.

## 7. Resumen de conceptos

| Concepto | Dónde se vio |
|---|---|
| Testear donde ya hubo bugs (fronteras de conversión) | LoginResponse, mapper, interceptor, queryKeys |
| Testabilidad como subproducto arquitectónico | Handler testeado con 3 mocks, sin EF/ASP.NET |
| Referenciar solo Application en el test | Afirmación compilada de dirección de dependencias |
| Mocks de comportamiento (Verify) para reglas de arquitectura | `Times.Never`/`Times.Once` en login/register |
| Aislar colaboradores baratos, usar los reales si son gratis | axios mockeado, store de zustand real |
| Tests de contrato como especificación ejecutable | Shape de LoginResponse, reglas null→undefined |
| El gate de CI como consecuencia de tests útiles | TODO eliminado tras 15 tests verdes |
| Pirámide: unidades puras primero, integración después | WebApplicationFactory/Testing Library documentados como siguiente nivel |

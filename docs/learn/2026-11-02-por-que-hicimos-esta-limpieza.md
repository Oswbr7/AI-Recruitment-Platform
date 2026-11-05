# Aprendizaje — Por qué hicimos esta limpieza (Bloque 1, 2026-11-02)

> Documento educativo complementario a `docs/sessions/2026-11-02-organizacion-bloque-1.md`.
> Aquí no se repite *qué* se hizo, sino **por qué** se hace cada cosa y qué concepto de ingeniería hay detrás. Este proyecto existe para aprender, así que cada decisión de la sesión se explica como una lección.

---

## 1. Código muerto: por qué borrarlo es ingeniería, no estética

### El problema del scaffolding acumulado

Los proyectos `.Shared` son el ejemplo perfecto. Al iniciar los servicios con `dotnet new`, la plantilla creó 4 proyectos compartidos vacíos "por si acaso". Nadie los llenó, pero **nadie los eliminó**. Duraron epics enteros como zombies: 12 `.csproj` los referenciaban, aparecían en la solución y en el documento de arquitectura, y aun así **no contenían ni una sola línea de código**.

¿Por qué esto es dañino?

1. **Carga cognitiva**: quien lee el repo (o la IA que lo asiste) debe investigar si `.Shared` es importante. Cada proyecto fantasma es una pregunta sin respuesta que alguien tendrá que pagar.
2. **Falsa confianza documental**: el documento de arquitectura decía "BuildingBlocks.Contracts existe como stub". Nunca existió. Cuando la documentación describe fantasías, las decisiones de diseño (CI/CD, Kubernetes) se construyen sobre arena.
3. **Costo de build real**: cada proyecto vacío compila a un DLL, se restaura en CI y enlaza en el grafo de dependencias. Barato por unidad, ridículo en conjunto.
4. **Rompe la regla del código honesto**: en un repo que se usa para aprender, el código debe ser un modelo fiel de las buenas prácticas que se enseñan. Un proyecto vacío referenciado enseña "está bien dejar placeholders", que es exactamente lo contrario de lo que la Clean Architecture que declara `Notas.md` predica.

### La técnica: "grep antes que rm"

Nunca se borra por intuición. El procedimiento aplicado a cada candidato:

```
1. ¿Quién lo importa/usa?   → grep del nombre sobre todo el repo
2. ¿Hay un barrel (index.ts) que lo reexporte? → leer los barrels
3. ¿Está registrado en algún DI/Program.cs?     → grep de la clase
4. Borrar
5. Compilar TODO           → el compilador es el juez final
```

El caso `auth-service` demuestra por qué el paso 1 es crítico: sus clases `Result` **parecían** duplicados muertos de los BuildingBlocks (y el documento las describía como "no relacionadas, nunca tocadas"), pero el grep reveló que `LoginCommand`, `RegisterUserCommand` y sus handlers **las usan en producción**. Borrarlas habría roto el login. Lo contrario también ocurrió: `GlobalExceptionHandler` de auth **parecía** importante (es un manejador de excepciones, ¿cómo no lo iba a usar?), pero jamás fue registrado — era una copia del que ya provee `AddPlatformInfrastructure`.

**Lección**: el nombre o la apariencia no determina si el código está vivo; las referencias sí. Y cuando dos fuentes dicen cosas distintas (documento vs. código), el código manda y el documento se corrige.

## 2. Proyectos vacíos y el grafo de `ProjectReference`

Una solución .NET es un **grafo dirigido de dependencias**: `Api → Application → Domain`, y `Api/Infrastructure → BuildingBlocks`. Los Dockerfiles publican solo el `.csproj` del `Api`; MSBuild resuelve transitivamente todo el grafo por los `ProjectReference`.

Consecuencias prácticas que esta sesión ilustra:

- **Quitar una referencia es seguro cuando el proyecto destino está vacío**: no hay código que pierda acceso a nada. Las 12 líneas eliminadas eran puro ruido topológico.
- **La `.slnx` (o `.sln`) y los Dockerfiles son independientes**: los Dockerfiles nunca usaron la solución, por eso eliminar proyectos de la slnx no los afectó. La slnx es para los desarrolladores y el CI; el Dockerfile es para el despliegue. Conviene que ambos existan y estén correctos, pero obedecen a consumidores distintos.
- **`BuildingBlocks.Infrastructure` fuera de la slnx era un bug silencioso**: el proyecto existía, se compilaba como dependencia de los servicios (por eso nadie notó nada roto), pero el CI **no lo compilaba directamente ni verificaba sus warnings**. Un proyecto huérfano de la solución se convierte en un punto ciego: ahí es donde se cuelan los warnings NU1510 que descubrimos (paquetes redundantes con el framework). En el CI todo lo que importa debe estar en la solución.

## 3. Arreglar el CI: el pipeline debe reflejar la realidad

El workflow tenía dos mentiras:

1. **Apuntaba a `RecruitmentPlatform.sln`**, que no existía. Cualquier push a `main`/`develop` habría fallado con "file not found" — o peor, nunca se ejecutó porque quizá no hay pushes recientes, y la rotura permaneció invisible.
2. **Ejecutaba `dotnet test`** sin existir un solo proyecto de tests. Esto es peor que no tener el paso: un pipeline que "pasa" sin probar nada genera **falsa confianza**. El badge verde del repo significaba "compila", no "está bien".

La corrección aplicada (apuntar al `.slnx` real, quitar el paso fantasma con un `TODO`) sigue dos principios:

- **Un pipeline es un contrato**: cada paso debe verificar algo real. Un paso decorativo se elimina o se deja explícitamente anotado como pendiente.
- **El TODO con contexto**: el comentario en el YAML no dice solo "falta tests", dice *por qué* se quitó y *cuándo* volverá ("once test projects exist"). Los TODOs buenos son decisiones documentadas, no olvidos.

Concepto adicional para el siguiente paso (CI real): como dice `Notas.md`, "se debe compilar dependiendo del objetivo del pipeline, no todo el proyecto" — el camino maduro es *path filtering* (jobs condicionados por qué carpetas cambiaron en el diff), que se puede agregar cuando haya más de un job.

## 4. `.env.example`: el patrón de configuración reproducible

### El problema que resuelve

El `docker-compose.yaml` usa interpolación de variables: `${JWT_KEY}`, `${POSTGRES_USER}`... Docker Compose las lee de un archivo `.env` junto al compose, pero ese archivo **no estaba en el repo** (correctamente, está en `.gitignore` porque contiene secretos). El resultado: un `git clone` fresco no podía levantar el stack — el developer nuevo tenía que adivinar qué variables existían, de dónde salían y qué formato esperaban.

### La solución: plantilla + ignorar el real

El patrón estándar es versionar **`.env.example`** (todos los nombres de variables, valores de desarrollo de mentira, comentarios explicativos) y mantener **`.env`** fuera del control de versiones. Flujo:

```
git clone → cp .env.example .env → docker compose up → funciona
```

Detalles que la plantilla del repo documenta y que valen la pena entender:

- **`JWT_KEY` mínimo 32 caracteres**: no es capricho del compose. Los `JwtOptions` usan `ValidateDataAnnotations` con `ValidateOnStart()` — la app **falla al arrancar** si la clave es corta (*fail-fast*: mejor caer en el arranque que aceptar tokens con una clave débil). La plantilla repite la restricción para que el error nunca ocurra.
- **`VITE_` como prefijo obligatorio**: Vite, por seguridad, **solo** inyecta al bundle las variables con ese prefijo. Es su mecanismo para evitar que secretos terminen en código público del navegador. Por eso el `.env.example` del frontend lleva la advertencia "nunca secretos aquí": todo lo que empieza con `VITE_` será visible por cualquiera que abra las DevTools.
- **El TLD `.local` de pgadmin**: lección real del Epic-006 guardada como comentario — pgadmin valida el email del admin y rechaza TLDs inválidos. Las plantillas son el lugar correcto para preservar este tipo de lecciones de configuración.

## 5. El documento de arquitectura como fuente de verdad... mantenida

`docs/architecture.md` se creó para planificar CI/CD y Kubernetes. Si dice "no hay `.sln`" cuando sí lo hay (y el CI depende de él), "hay carpeta `kubernetes/` vacía" cuando no existe, o "hay proyecto `Contracts`" cuando jamás existió, entonces cualquier plan construido sobre él arranca equivocado.

La dinámica que se corrigió es un síntoma común: **el documento describía el repo de hace N commits y nadie lo actualizó cuando el código cambió**. Los mecanismos que esta sesión deja para que no se repita:

1. **Encabezado de "última actualización"** con enlace al worklog de la sesión → trazabilidad.
2. **Worklog por sesión en `docs/sessions/`** (convención nueva, ver `AGENTS.md`) → el historial explica el porqué de cada estado.
3. **Verificación mecánica**: el documento se corrigió *después* de compilar, con los hechos ya comprobados, no antes.

## 6. El compilador como red de seguridad final

Tras todos los borrados se ejecutaron dos verificaciones completas:

```bash
dotnet build AIRecruitmentPlatform.slnx -c Release   # backend
npm ci && npm run build                              # frontend (tsc -b && vite build)
```

Esto cierra el ciclo de confianza: grep + barrels + DI nos dicen que *creemos* que nada referencia lo borrado; el compilador de C# y el de TypeScript lo **demuestran** (TypeScript fallaría ante cualquier import roto; MSBuild fallaría ante cualquier referencia faltante).

Los 17 warnings que quedan (CS8618 de nullable reference types en entidades con constructor privado, NU1510 de paquetes redundantes) son **deuda preexistente documentada**, no errores de esta sesión — y pasaron a la lista de descubrimientos del bloque 2. Esta disciplina — *dejar el warning registrado con dueño y contexto en vez de "arreglarlo de paso"* — es la que mantiene las sesiones de limpieza enfocadas y reversibles.

## 7. Resumen de conceptos para llevarse

| Concepto | Dónde se vio |
|---|---|
| Código muerto = carga cognitiva + documentación falsa | Proyectos `.Shared`, stubs `Class1.cs`, carpeta `@/` |
| "Grep antes que rm" + compilar después | Toda la sesión; `Result` de auth conservado vs. `GlobalExceptionHandler` borrado |
| Grafo de `ProjectReference` y solución vs. Dockerfiles | Eliminación de `.Shared`, fix de la slnx |
| Pipeline = contrato de verificación real; nada de pasos decorativos | Fix de `ci.yml` |
| Fail-fast en configuración (`ValidateOnStart`) | Documentación de `JWT_KEY` ≥ 32 chars |
| Patrón `.env.example` + `.gitignore` | Plantillas de docker y frontend |
| Seguridad de variables en el bundle (`VITE_` prefix) | `.env.example` del frontend |
| El código manda sobre el documento; el documento se corrige | `architecture.md` actualizado post-build |
| Un build verde de la solución completa es la verdad final | `dotnet build` + `npm run build` en verde |

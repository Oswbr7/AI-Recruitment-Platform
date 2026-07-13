Es una arquitectura de microservicios basada en Clean Architecture, CQRS, Vertical Slice Architecture y Domain-Driven Design tactical patterns, con comunicación HTTP inicialmente y preparada para mensajería asíncrona."

1. Clean Architecture

Cada servicio tiene capas bien definidas.

API
    │
Application
    │
Domain
    │
Infrastructure

La regla más importante es:

Las dependencias siempre apuntan hacia el centro.

API
 ↓
Application
 ↓
Domain

2. Vertical Slice Architecture

En lugar de organizar el código por tipo:

Commands/

Handlers/

Validators/

lo organizamos por funcionalidad:

Features/

    Auth/

        Login/

        Register/

        Logout/

Cada caso de uso vive en su propia carpeta.

3. CQRS

No mezclamos lectura y escritura.

LoginCommand

↓

LoginHandler

Commands modifican datos.

Queries solo leen datos.

4. Result Pattern

En lugar de lanzar excepciones por reglas de negocio:

return Result.Failure(UserErrors.EmailAlreadyExists);

Solo usamos excepciones para errores realmente inesperados.

5. Pipeline Behaviors

Toda la lógica transversal pasa por el pipeline.

Validation

↓

Logging

↓

Handler

El Handler solo contiene lógica de negocio.

6. Building Blocks

En vez de copiar código entre microservicios, tenemos bibliotecas compartidas.

BuildingBlocks.Application

BuildingBlocks.Domain

7. Microservices

Cada servicio tiene su propia responsabilidad.

Auth Service

Candidate Service

Job Service

Interview Service

AI Service

Cada uno tendrá su propia base de datos.


------------------------

1.- Registro de usuairo

URL:  http://localhost:5000/api/auth/register
Método: POST
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "Password123!",
  "firstName": "Juan",
  "lastName": "Pérez"
}

Respuesta esperada:

201/200: Guid del usuario creado (ej: "3fa85f64-5717-4562-b3fc-2c963f66afa6")
400: Error si el email ya existe o los datos son inválidos

2. Login
URL: http://localhost:5000/api/auth/login
Método: POST
Content-Type: application/json
Body (JSON):

{
  "email": "usuario@example.com",
  "password": "Password123!"
}

Respuesta esperada:

200:
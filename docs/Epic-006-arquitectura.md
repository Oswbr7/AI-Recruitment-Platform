# EPIC-006 - Infrastructure Foundation

## Objetivo

Preparar toda la infraestructura base de la plataforma antes de introducir CI/CD y Kubernetes.

Esta épica NO debe modificar la arquitectura existente.

Debe mantener exactamente la misma estructura de la solución.

Su objetivo es dejar la aplicación lista para ser desplegada en Kubernetes.

---

# Arquitectura

No modificar.

Mantener

Api

Application

Domain

Infrastructure

Shared

Frontend

---

# Logging

Implementar Serilog.

No utilizar Console.WriteLine.

No utilizar ILogger directamente para configuración.

Configurar Serilog como proveedor principal.

---

# Logging Requirements

Registrar automáticamente

HTTP Requests

HTTP Responses

Unhandled Exceptions

Warnings

Startup

Shutdown

Database Errors

Validation Errors

Authentication Failures

---

# Logging Format

Utilizar Logging Estructurado.

Nunca interpolar strings.

Correcto

logger.Information(
    "Creating job {JobId}",
    job.Id);

Incorrecto

logger.Information(
    $"Creating job {job.Id}");

---

# Logging Sinks

Console

Rolling File

Preparar configuración para Seq (comentada)

---

# Configuración

Toda la configuración debe venir desde

Environment Variables

↓

appsettings.json

↓

appsettings.Development.json

↓

appsettings.Production.json

No valores hardcodeados.

---

# Options Pattern

Todos los módulos deben utilizar

IOptions<T>

Crear

JwtOptions

DatabaseOptions

CorsOptions

SwaggerOptions

StorageOptions

No acceder directamente a IConfiguration en la lógica.

---

# Health Checks

Todos los microservicios deben implementar

GET /health

GET /health/live

GET /health/ready

Utilizar

Microsoft.Extensions.Diagnostics.HealthChecks

---

# Health Checks Requirements

Verificar

PostgreSQL

Database Connectivity

Application Ready

---

# Middleware

Crear middleware reutilizable.

No lógica en Program.cs.

Program.cs únicamente debe contener

builder.Services

↓

builder.Build()

↓

UseMiddlewares()

↓

MapEndpoints()

---

# Middlewares

Request Logging

Correlation Id

Exception Handler

Security Headers

---

# Correlation Id

Todos los requests deben generar

X-Correlation-Id

Si ya existe

Debe reutilizarse.

Debe aparecer en todos los logs.

---

# CORS

Mover configuración a

CorsOptions

Permitir configuración por ambiente.

No dejar AllowAnyOrigin en producción.

---

# Compression

Agregar Response Compression.

gzip

brotli

---

# Security Headers

Agregar middleware.

Headers

X-Content-Type-Options

X-Frame-Options

Referrer-Policy

Content-Security-Policy

X-XSS-Protection

---

# Rate Limiting

Implementar ASP.NET Rate Limiting.

Política

100 requests/minuto

Preparar para configuración futura.

---

# Problem Details

Todos los errores deben seguir RFC7807.

Mantener Result<T> para respuestas exitosas.

Errores

ProblemDetails

---

# OpenAPI

Configurar Swagger.

Agregar

JWT Authentication

Version

Description

XML Comments

---

# API Versioning

Preparar estructura para

v1

Aunque inicialmente solo exista

v1

---

# Docker

Todos los servicios deben tener

Dockerfile

Multi-stage

SDK

↓

Publish

↓

Runtime

---

# Docker Requirements

Utilizar

.NET Runtime Image

No SDK en producción.

Usuario no root.

EXPOSE únicamente puertos necesarios.

---

# Docker Compose

Crear docker-compose completo.

Servicios

Frontend

AuthService

JobService

CandidateService

CompanyService

InterviewService

PostgreSQL

PgAdmin

---

# Docker Networks

Crear

backend-network

frontend-network

No utilizar red por defecto.

---

# Docker Volumes

Persistencia

PostgreSQL

Logs

---

# Environment Variables

Todos los servicios deben utilizar

ASPNETCORE_ENVIRONMENT

ConnectionStrings

JWT

CORS

Logging

No valores hardcodeados.

---

# Database

Aplicar migraciones automáticamente únicamente en Development.

Nunca en Production.

---

# Dependency Injection

Toda la configuración mediante

DependencyInjection.cs

No registrar servicios directamente en Program.cs.

---

# Shared Infrastructure

Crear proyecto

Shared.Infrastructure

Mover allí

Logging

Health Checks

Options

Middlewares

Extensions

Correlation

Security

No duplicar código entre microservicios.

---

# Base Extensions

Crear

AddInfrastructure()

UseInfrastructure()

AddHealthChecks()

AddLogging()

AddOptions()

---

# Monitoring Preparation

Preparar

OpenTelemetry

No implementarlo todavía.

Dejar estructura lista.

---

# Metrics Preparation

Preparar

Prometheus

No implementarlo todavía.

---

# Tracing Preparation

Preparar

Distributed Tracing

No implementarlo todavía.

---

# Configuration Validation

Todos los Options deben validarse al iniciar la aplicación.

Fail Fast.

---

# Folder Structure

Shared.Infrastructure

Logging

Health

Middlewares

Extensions

Options

Security

Correlation

Compression

Configuration

---

# Quality

No usar any.

No lógica en Program.cs.

No duplicar Middlewares.

No duplicar Extensions.

No configuración hardcodeada.

---

# Acceptance Criteria

✓ Serilog

✓ Rolling Files

✓ Health Checks

✓ Correlation Id

✓ Compression

✓ Rate Limiting

✓ Security Headers

✓ Dockerfiles optimizados

✓ Docker Compose completo

✓ Environment Variables

✓ Shared Infrastructure Library

✓ Program.cs limpio

La solución debe quedar completamente preparada para comenzar CI/CD y Kubernetes sin necesidad de refactorización.

---

# Notas de implementación (lo que realmente se hizo)

Este epic fue escrito sin conocimiento del estado real del repo. Antes de implementar se auditó el código existente y se corrigieron varias asunciones. Esta sección documenta lo que **realmente se construyó**, no lo que el epic pedía literalmente.

## Correcciones de arquitectura vs. el epic original

- **`BuildingBlocks.Infrastructure`** (no "Shared.Infrastructure") — nuevo proyecto en `building-blocks/`, para respetar la convención de nombres ya establecida por `BuildingBlocks.Application`/`BuildingBlocks.Domain`.
- Cada servicio ya tenía su propio `{Service}.Infrastructure.DependencyInjection.AddInfrastructure()` (EF Core + repos) — no se tocó ese nombre. Las extensiones nuevas y compartidas se llaman **`AddPlatformInfrastructure()`** (servicios) y **`UsePlatformInfrastructure()`** (middlewares) para evitar la colisión.
- **Health Checks y Swagger+JWT ya existían parcialmente** (4 de 5 servicios) antes de este epic — se completó (Postgres real, `/health/live`+`/health/ready`) y se unificó, no se construyó desde cero.
- **`GlobalExceptionHandler` ya devolvía RFC7807 `ProblemDetails`** — se dejó ese comportamiento intacto, solo se de-duplicó (una sola copia en `BuildingBlocks.Infrastructure.Middlewares`, en vez de 5 copias idénticas).
- **API Versioning**: no se cambiaron rutas (`/api/jobs` sigue siendo `/api/jobs`, no `/api/v1/jobs`) — cambiarlas rompía los API clients de las 5 features del frontend sin beneficio real hoy. El epic mismo dice "aunque inicialmente solo exista v1".
- **Redis y RabbitMQ existían en el `docker-compose.yaml` pero cero código los usaba** (confirmado por grep en todo `services/**`) — eran scaffolding muerto. Se eliminaron del compose.
- **`StorageOptions`** se creó como placeholder sin registrar/usar — no existe ningún feature de storage en el proyecto, igual que OpenTelemetry/Prometheus/Tracing (preparados, no implementados).

## `BuildingBlocks.Infrastructure` — qué contiene

`Options/` (Jwt, Cors, Swagger, RateLimit, Storage-placeholder), `Logging/SerilogConfiguration.cs`, `Health/HealthCheckExtensions.cs`, `Correlation/CorrelationIdMiddleware.cs`, `Middlewares/{SecurityHeadersMiddleware,GlobalExceptionHandler}.cs`, `Security/JwtAuthenticationExtensions.cs`, `Compression/ResponseCompressionExtensions.cs`, `Configuration/OptionsValidationExtensions.cs`, `Extensions/{WebApplicationBuilderExtensions,WebApplicationExtensions,MigrationExtensions}.cs`. Más `BuildingBlocks.Application/Common/Http/{Result,PagedResponse}.cs` — el envelope HTTP `{Success,Message,Data}` que ya usaban los 5 servicios (distinto del `Result`/`Error` que ya existía en `Common/Errors/`, que es un monad de dominio y no se tocó).

Paquetes nuevos agregados a `Directory.Packages.props`: `Serilog.AspNetCore`, `Serilog.Sinks.Console`, `Serilog.Sinks.File`, `Serilog.Enrichers.Environment`, `Serilog.Enrichers.Thread`, `AspNetCore.HealthChecks.NpgSql`, `Microsoft.Extensions.Options.ConfigurationExtensions`, `Microsoft.Extensions.Options.DataAnnotations`, `Microsoft.EntityFrameworkCore.Relational`. Se subió `System.IdentityModel.Tokens.Jwt` de 8.0.0 a 8.0.1 (conflicto de versión transitivo con `JwtBearer`).

## Por servicio (job/candidate/company/interview-service)

- `GlobalExceptionHandler.cs` y `Result<T>`/`PagedResponse<T>` propios eliminados — reemplazados por los de `BuildingBlocks.*` (mismo shape JSON, cero cambio de contrato con el frontend).
- Nuevo `{Service}.Application/DependencyInjection.cs::AddApplication()` — mueve el registro de MediatR + FluentValidation + los 3 Behaviors fuera de `Program.cs`.
- `{Service}.Infrastructure/DependencyInjection.cs` — se le agregó el health check real de Postgres (`AddPlatformDatabaseCheck`).
- `Program.cs` reducido a: `builder.AddPlatformInfrastructure(nombre)` → `AddApplication()` → `AddInfrastructure()` → `Build()` → migración gateada a Development → `UsePlatformInfrastructure()` → `MapEndpoints()` → `MapPlatformHealthChecks()`.
- `appsettings.json` (+Serilog) y `appsettings.Development.json` (+Cors, +Swagger).
- `Dockerfile`: usuario no-root (`USER $APP_UID`, la imagen `aspnet:10.0` ya lo trae, solo había que activarlo) + carpeta `/app/logs` para el sink de archivo.

## `auth-service` (el outlier — cambios adicionales)

- Se agregó `AuthService.Infrastructure/DependencyInjection.cs::AddInfrastructure()` (antes registraba `AppDbContext`/repos/`IJwtProvider`/`IPasswordHasher` inline en `Program.cs`, como los otros 4 ya no hacían).
- Swagger agregado **por primera vez** (antes solo tenía el OpenAPI nativo de .NET, sin UI).
- `UseHttpsRedirection()` agregado (no existía).
- Orden de CORS corregido (antes se registraba después de `MapEndpoints`, ahora sigue el mismo orden que los otros 4).
- `GlobalExceptionHandler` wireado por primera vez (antes no tenía ninguno — un error no manejado devolvía la página de error default de ASP.NET).
- Se eliminó `AuthService.Infrastructure/Persistence/DatabaseInitializer.cs`, que migraba la base **sin ningún gate de ambiente** (bug real, corría hasta en producción) — reemplazado por el `MigrateDatabaseAsync<T>()` compartido, gateado a `IsDevelopment()`.
- **No se tocó**: `AuthController.cs`, `LoginCommand`/`RegisterUserCommand`, ni los dos `Result` propios de auth-service (`AuthService.Api/Common/Results` y `AuthService.Application/Common/Results`) — son un tipo distinto al envelope HTTP unificado y tocarlos arriesgaba el login.

## Docker Compose

- Eliminados `redis` y `rabbitmq` (sin uso).
- Red única `recruitment-network` dividida en `backend-network` (postgres + pgladmin + los 5 servicios) y `frontend-network` (frontend + los 5 servicios).
- Agregado servicio `pgadmin` (imagen `dpage/pgadmin4`, puerto `5050`).
- Agregado servicio `frontend`, con un `Dockerfile` y `nginx.conf` nuevos en `frontend/web-app/` (no existían antes) — build multi-stage `node:20-alpine` → `nginx:alpine`, con fallback SPA.
- Un volumen de logs por servicio (`{servicio}_logs:/app/logs`).
- **Aviso**: el frontend sigue llamando a los servicios por puertos publicados del host desde el navegador (no hay reverse-proxy todavía) — unir `frontend-network` con los servicios no tiene efecto funcional inmediato hasta que exista un proxy real en nginx. Eso queda para el futuro epic de Kubernetes/gateway.

## Verificación realizada

Los 5 servicios se corrieron localmente uno por uno (`dotnet run`) contra Postgres real, confirmando: `/health`, `/health/live`, `/health/ready` reales; JWT auth (401 sin token, 200 con token válido); `ProblemDetails` intacto en errores de validación; `CorrelationId` presente en **todas** las líneas de log incluida la de finalización de request (se encontró y corrigió un bug de orden de middlewares: `CorrelationIdMiddleware` debe envolver a `UseSerilogRequestLogging`, no al revés); compresión gzip funcionando; rate limiting devolviendo 429 después de ~100 requests/minuto. En `auth-service` además se probó el flujo completo register → login → endpoint autenticado (`/api/users`) end-to-end.

**Verificación end-to-end del stack completo — COMPLETADA** (una vez liberado espacio en disco): `docker compose build && docker compose up` levantó los 8 contenedores (postgres, pgadmin, los 5 servicios, frontend) exitosamente. Se confirmó: los 5 servicios responden `Healthy` en `/health/ready` a través de sus puertos publicados; un JWT emitido por `auth-service` (register→login) es aceptado por `job-service` y `candidate-service` sin fricción (mismo `Jwt:Key` compartido); los 5 contenedores corren como usuario `app` (no root, `docker exec ... whoami`); las redes `backend-network`/`frontend-network` quedaron exactamente como se diseñaron; el frontend sirve la SPA (`http://localhost:5173`) vía nginx; pgadmin quedó accesible en `http://localhost:5050`.

Durante esta verificación aparecieron 3 problemas reales, ya corregidos:
1. **`npm ci` fallaba en el build del frontend** (`Missing: @emnapi/runtime@1.11.3 from lock file`) — el `package-lock.json` estaba desincronizado. Se regeneró desde cero (`rm -rf node_modules package-lock.json && npm install`).
2. **La imagen `node:20-alpine` (musl) fallaba igual** incluso con el lockfile regenerado — el motor nativo de Tailwind v4 (`@tailwindcss/oxide`) tiene fricción conocida con musl/wasm-fallback. Se cambió la etapa de build del `Dockerfile` del frontend a `node:24-slim` (Debian/glibc), lo cual resolvió el problema de raíz.
3. **`PGADMIN_EMAIL=admin@recruitment.local` en `.env` crasheaba pgadmin en loop** — pgadmin valida el email y rechaza `.local` por ser un TLD reservado. Se cambió a `admin@recruitment.dev`.

También se agregó un `.dockerignore` en la raíz del repo y otro en `frontend/web-app/` — el build context se estaba enviando completo (300+ MB, incluyendo `node_modules`, `bin/`, `obj/`, `.git/`) porque no existía ninguno; esto además aceleró notablemente los builds.

## Fuera de alcance (confirmado, sin cambios)

- OpenTelemetry, Prometheus, Distributed Tracing — solo estructura preparada, sin implementar, tal cual pedía el epic.
- Manifiestos de Kubernetes y pipelines de CI/CD — este epic deja la app lista, no los construye.
- Pruebas unitarias — fuera de alcance en todos los epics de este proyecto.
# AI Recruitment Platform

Plataforma de reclutamiento (ATS) construida como **microservicios .NET 10** + **frontend React 19/TypeScript**. Su propósito es didáctico: implementar y aprender en producción los patrones que usa un sistema real — Clean Architecture, CQRS, Vertical Slice, Domain-Driven Design táctico, Docker, CI/CD y Kubernetes.

## Módulos

| Servicio | Puerto | Responsabilidad |
|---|---|---|
| `auth-service` | 5000 | Login/registro (JWT), usuarios |
| `job-service` | 5001 | Vacantes |
| `candidate-service` | 5002 | Candidatos (+ notas) |
| `company-service` | 5003 | Empresas (+ contactos) |
| `interview-service` | 5004 | Entrevistas (+ feedback) |
| `frontend` | 5173 | SPA React (Vite + nginx) |
| `postgres` | 5432 | Un contenedor, una base de datos por servicio |
| `pgadmin` | 5050 | Administración de Postgres |

El **Dashboard** no tiene backend propio: agrega en el cliente datos de los demás módulos con TanStack Query.

## Arquitectura

```
frontend (React 19 + Vite + TS, TanStack Query/Table, RHF + Zod, Zustand)
   │  HTTP + JWT Bearer (en K8s: un único ingress /api/*)
   ▼
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ auth-service│ job-service │candidate-svc│ company-svc │interview-svc│   Minimal APIs (.NET 10)
│  Api        │  Api        │  Api        │  Api        │  Api        │   CQRS + MediatR + FluentValidation
│  Application│  Application│  Application│  Application│  Application│   (Commands/Queries por caso de uso)
│  Domain     │  Domain     │  Domain     │  Domain     │  Domain     │   Entidades ricas + Value Objects
│  Infrastr.  │  Infrastr.  │  Infrastr.  │  Infrastr.  │  Infrastr.  │   EF Core + Repository + UnitOfWork
└──────┬──────┴──────┬──────┴──────┬──────┴──────┬──────┴──────┬──────┘
       └──────────────┴─────────────┴─────────────┴─────────────┘
                              │  BuildingBlocks (compartidos)
                              ▼
              Postgres 17 (una BD por servicio)
```

Transversal (en `building-blocks/` y activo en los 5 servicios): Serilog con Correlation ID, health checks (`/health`, `/live`, `/ready`), Options con validación fail-fast, CORS, rate limiting, compresión, security headers, manejo de errores RFC7807 y Swagger con JWT. Detalle completo en **[`docs/architecture.md`](docs/architecture.md)**.

## Stack

- **Backend**: .NET 10 · Minimal APIs · MediatR (CQRS) · FluentValidation · EF Core 10 + Npgsql · Serilog
- **Frontend**: React 19 · Vite 8 · TypeScript · Tailwind 4 · TanStack Query v5 / Table · React Hook Form + Zod · Zustand · Recharts · Axios
- **Infra**: Docker + docker-compose · GitHub Actions (CI/CD) · GHCR · Kubernetes (Kustomize + nginx Ingress) · kind para entorno local
- **Calidad**: xUnit + Moq (backend) · vitest + jsdom (frontend)

## Cómo empezar (desarrollo local)

**Prerequisitos**: .NET SDK 10 (`global.json` fija 10.0.301), Node 24+, Docker Desktop.

```bash
# 1. Clonar y preparar variables de entorno
cp infrastructure/docker/.env.example infrastructure/docker/.env
cp frontend/web-app/.env.example frontend/web-app/.env

# 2. Levantar toda la plataforma (Postgres, pgadmin, 5 servicios, frontend)
docker compose -f infrastructure/docker/docker-compose.yaml up -d --build

# 3. Verificar
curl http://localhost:5000/health/ready          # auth-service (los demás: 5001-5004)
open http://localhost:5173                        # frontend
open http://localhost:5000/swagger                # Swagger (uno por servicio, solo en Development)
```

Las migraciones EF se aplican automáticamente al arrancar en `Development`. Credenciales: cualquier registro vía `POST /api/auth/register` crea un usuario (rol `Candidate` por defecto) y `POST /api/auth/login` devuelve `{accessToken, expiresAt, user}`.

> El frontend en modo desarrollo (`npm run dev` en `frontend/web-app`) también funciona contra el compose levantado, usando su propio `.env`.

## Tests

```bash
dotnet test AIRecruitmentPlatform.slnx -c Release   # backend (xUnit + Moq)
cd frontend/web-app && npm run test                 # frontend (vitest)
```

Ambos gates corren en CI en cada PR/push. El piloto cubre handlers de auth (backend) e interceptores HTTP, query keys y mappers (frontend); el patrón está documentado para replicarlo a los demás servicios.

## Kubernetes

Manifiestos Kustomize (`base/` + overlays `staging`/`production`), Postgres en StatefulSet, migraciones como Job (EF migrations bundle), gateway nginx Ingress y walkthrough completo en **[`infrastructure/kubernetes/README.md`](infrastructure/kubernetes/README.md)**. En resumen:

```bash
kind create cluster --config infrastructure/kubernetes/kind-config.yaml
# …ingress-nginx, secret, imágenes… (pasos detallados en el README de kubernetes/)
kubectl apply -k infrastructure/kubernetes/overlays/staging
```

## CI/CD

| Workflow | Trigger | Qué hace |
|---|---|---|
| [`ci.yml`](.github/workflows/ci.yml) | PR/push a `main`/`develop` | Path filtering por job: build backend, lint+test+build frontend, build de las 6 imágenes Docker (sin push, con cache) |
| [`cd.yml`](.github/workflows/cd.yml) | push a `main` | Publica las 6 imágenes a GHCR con tags `<sha>` + `latest` |

Pendiente (plan por fases en `docs/sessions/`): despliegue automatizado a Kubernetes (environments staging/prod) cuando exista el clúster.

## Estructura del repositorio

```
├── services/                  # 5 microservicios (Api/Application/Domain/Infrastructure)
├── building-blocks/           # BuildingBlocks.Application/Domain/Infrastructure
├── frontend/web-app/          # React + Vite (features: auth, jobs, candidates, companies, interviews, dashboard)
├── infrastructure/
│   ├── docker/                # docker-compose.yaml, init-db, .env.example
│   └── kubernetes/            # Manifiestos Kustomize + kind-config + README
├── docs/
│   ├── architecture.md        # ⚠️ Estado real del repo (referencia para planificar)
│   ├── sessions/              # Worklog por sesión de trabajo (contexto + cambios + verificación)
│   ├── learn/                 # Documentos educativos: el POR QUÉ de cada decisión
│   └── frontend-tech-debt.md  # Deuda vigente verificada
├── .github/workflows/         # CI/CD
├── AIRecruitmentPlatform.slnx # Solución (18 proyectos + tests)
└── AGENTS.md                  # Convenciones de trabajo (humanos e IAs)
```

## Convenciones del proyecto

- **Central Package Management**: versiones de paquetes solo en `Directory.Packages.props`.
- **Documentación viva**: cada sesión de trabajo deja worklog en `docs/sessions/` y actualiza `docs/architecture.md` si cambia la estructura. Ver `AGENTS.md`.
- **Sin secretos en el repo**: solo `.env.example`; los secretos de K8s se crean manualmente (ver `infrastructure/kubernetes/secrets/README.md`).

## Roadmap

- [x] Microservicios (5) con Clean Architecture + CQRS
- [x] Frontend por features con agregación de dashboard en cliente
- [x] Infraestructura transversal (logging, health, errores, rate limit, seguridad)
- [x] Dockerización end-to-end verificada
- [x] CI con path filtering + validación de imágenes / CD de imágenes a GHCR
- [x] Manifiestos Kubernetes (Kustomize, migraciones, gateway) — *smoke test en kind pendiente*
- [x] Primeros tests (piloto) + gates en CI
- [ ] Despliegue automatizado a K8s (staging/prod) — Fase 3
- [ ] Replicar tests a los 5 servicios; componentes (Testing Library); cobertura
- [ ] Tests de integración (WebApplicationFactory) y validadores
- [ ] Rol Recruiter/Admin en el registro (hoy se fuerza `Candidate`)
- [ ] API Gateway/BFF evaluación, OpenTelemetry/Prometheus

Epic

EPIC-002 - Candidate Management

Objetivo:

Implementar el módulo completo de gestión de candidatos para una plataforma ATS, reutilizando exactamente la arquitectura existente del proyecto (Clean Architecture + Vertical Slice + CQRS + React + TanStack Query + Design System).

No modificar la arquitectura existente.

Toda nueva funcionalidad debe seguir exactamente los patrones ya implementados en el módulo Jobs.

Arquitectura obligatoria

Debe respetarse exactamente la arquitectura existente.

#Backend

Api
Application
Domain
Infrastructure
Shared

#Frontend

features
shared
components
app

No crear nuevas arquitecturas.

No crear servicios innecesarios.

No introducir patrones diferentes.

#Backend

Cada funcionalidad debe implementarse como Vertical Slice.

Ejemplo:

Features

Candidates

CreateCandidate

CreateCandidateCommand.cs

CreateCandidateValidator.cs

CreateCandidateHandler.cs

CreateCandidateResponse.cs

GetCandidates

GetCandidate

UpdateCandidate

DeleteCandidate

MoveCandidateStage

AddCandidateNote

AddCandidateTag

UploadResume

-Cada carpeta representa exactamente una historia de usuario.

#Endpoints

Implementar únicamente Minimal APIs.

No Controllers.

Todos implementando

IEndpoint

-Todos registrados automáticamente mediante reflexión usando EndpointExtensions existente.

#CQRS

Todos los endpoints deben usar MediatR.

No acceder al DbContext desde los Endpoints.

Flujo obligatorio:

Endpoint

↓

MediatR

↓

Pipeline Behaviors

↓

Validator

↓

Handler

↓

Repository

↓

EF Core

#Validación

Toda validación debe implementarse únicamente con FluentValidation.

No validar manualmente en Handlers.

#Dominio

Crear entidad Candidate.

Debe ser rica.

No utilizar setters públicos.

Candidate

Propiedades:

Id

FirstName

LastName

Email

Phone

Location

Headline

Summary

LinkedInUrl

GithubUrl

PortfolioUrl

CurrentCompany

CurrentPosition

YearsOfExperience

ExpectedSalary

Currency

Stage

Status

CreatedAt

UpdatedAt

-Todos los setters privados.

-Crear métodos de dominio.

Ejemplo

MoveToStage()

Archive()

Restore()

UpdateProfile()

No modificar propiedades directamente.

#Enums

Crear:

CandidateStage

Applied

Screening

TechnicalInterview

HRInterview

Offer

Hired

Rejected

Crear:

CandidateStatus

Active

Archived

#Repositories

Crear:

ICandidateRepository

Métodos

AddAsync

UpdateAsync

DeleteAsync

GetByIdAsync

GetPagedAsync

ExistsAsync

SaveChangesAsync

-No usar DbContext directamente desde Application.

#EF Core

Crear:

CandidateConfiguration

Usar IEntityTypeConfiguration.

No usar DataAnnotations.

API

Endpoints:

POST /api/candidates

GET /api/candidates

GET /api/candidates/{id}

PUT /api/candidates/{id}

DELETE /api/candidates/{id}

Adicionales:

POST /api/candidates/{id}/move

POST /api/candidates/{id}/archive

POST /api/candidates/{id}/restore

#Paginación

GET debe soportar:

page

pageSize

search

stage

status

sortBy

sortDirection

-No devolver listas completas.

Crear:

PagedResponse<T>

en Shared.

#Response

-Todos los endpoints deben devolver

{
  "success": true,
  "message": "",
  "data": {}
}

Usar Result<T> existente.

#Frontend

Crear módulo

features

candidates

Estructura:

api

dto

mappers

hooks

components

pages

models

-Exactamente igual que Jobs.

#API

Crear:

candidateApi

Métodos:

create

update

delete

getById

getPaged

moveStage

archive

restore

Todos usando

httpClient

#TanStack Query

Hooks:

useCandidates

useCandidate

useCreateCandidate

useUpdateCandidate

useDeleteCandidate

useMoveCandidateStage

-Todos invalidando queryKeys correspondientes.

#Tabla

Reutilizar DataTable existente.

No crear otra tabla.

Columnas:

Name

Email

Stage

Experience

Current Company

Updated

Actions

#Toolbar

Debe reutilizar DataTableToolbar.

Agregar

Search

Stage Filter

Status Filter

Create Candidate

#Formulario

React Hook Form

Zod

No usar useState.

Campos:

Nombre

Apellido

Email

Phone

LinkedIn

Github

Portfolio

Headline

Summary

Empresa actual

Posición

Experiencia

Salario esperado

Ubicación

#Candidate Detail

Nueva página

/candidates/:id

Secciones:

Header

Información

Timeline

Notas

Skills

Experiencia

Educación

-Aunque algunas se implementen inicialmente con placeholders, la estructura debe quedar preparada.

#Kanban

Crear vista

/candidates/pipeline

Columnas:

Applied

Screening

Technical

HR

Offer

Hired

Rejected

Usar:

dnd-kit

No otra librería.

Mover candidato

↓

Mutation

↓

Endpoint

↓

Actualizar tabla

↓

Toast

#Notes

Entidad

CandidateNote

Funciones:

Agregar

Editar

Eliminar

Timeline:

Candidate Created

Moved to Screening

Interview Scheduled

Note Added

Archived

#UI

Reutilizar Design System existente.

No crear nuevos estilos.

Usar:

Card

Badge

Dialog

Sheet

DropdownMenu

AlertDialog

Table

Skeleton

Button

Input

Textarea

Select

#Estados

Todos los listados deben tener:

Loading

Skeleton

Error

Empty State

Success

#Calidad

No duplicar código.

Crear mappers.

Crear DTOs.

No exponer entidades al frontend.

No usar any.

No usar lógica de negocio en React.

No usar lógica de negocio en Endpoints.

No usar lógica de negocio en Controllers (no existen).

Toda lógica pertenece al Dominio.

#Tests mínimos

Implementar pruebas para:

Validators
Handlers
Transiciones de estado del dominio (MoveToStage, Archive, Restore)

No es necesario cubrir la UI por ahora.
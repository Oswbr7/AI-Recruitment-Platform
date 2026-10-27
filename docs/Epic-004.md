# EPIC-004 - Interview Management

## Objetivo

Implementar el módulo completo de gestión de entrevistas para la plataforma ATS.

El módulo debe seguir exactamente la misma arquitectura utilizada en Jobs, Candidates y Companies.

No modificar la arquitectura existente.

No introducir nuevos patrones.

Debe reutilizar Clean Architecture, Vertical Slice, CQRS, MediatR, Repository Pattern, React Query y el Design System existente.

---

# Arquitectura

Backend

Api
Application
Domain
Infrastructure
Shared

Frontend

features
shared
components

No crear una arquitectura distinta.

---

# Vertical Slice

Cada funcionalidad debe implementarse como una Vertical Slice.

Features

Interviews

ScheduleInterview

GetInterviews

GetInterview

UpdateInterview

CancelInterview

CompleteInterview

RescheduleInterview

SubmitFeedback

---

# Minimal APIs

No Controllers.

Todos los endpoints implementan

IEndpoint

Todos registrados automáticamente mediante reflexión.

---

# CQRS

Todos los endpoints utilizan MediatR.

No acceder al DbContext desde Endpoints.

Flujo obligatorio

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

---

# Validación

Toda validación mediante FluentValidation.

No validar manualmente en los Handlers.

---

# Dominio

Crear entidad Interview.

No utilizar setters públicos.

Propiedades

Id

CandidateId

JobId

RecruiterId

Title

Description

InterviewType

InterviewStage

ScheduledAt

DurationMinutes

MeetingUrl

Location

Status

FeedbackSubmitted

OverallScore

CreatedAt

UpdatedAt

Todos los setters privados.

---

# Métodos del dominio

Schedule()

Reschedule()

Cancel()

Complete()

SubmitFeedback()

ChangeMeetingLink()

No modificar propiedades directamente.

---

# Enums

InterviewStatus

Scheduled

Completed

Cancelled

NoShow

InterviewType

Phone

Video

OnSite

Technical

HR

Panel

InterviewStage

Screening

Technical

HR

Final

---

# Relaciones

Una entrevista pertenece a

1 Candidate

1 Job

1 Recruiter

Puede tener

Muchos Feedbacks

---

# Repository

Crear

IInterviewRepository

Métodos

AddAsync

UpdateAsync

DeleteAsync

GetByIdAsync

GetPagedAsync

ExistsAsync

SaveChangesAsync

---

# EF Core

Crear

InterviewConfiguration

Usar IEntityTypeConfiguration.

No DataAnnotations.

Configurar relaciones.

Configurar índices.

Configurar longitudes.

---

# Endpoints

POST /api/interviews

GET /api/interviews

GET /api/interviews/{id}

PUT /api/interviews/{id}

DELETE /api/interviews/{id}

POST /api/interviews/{id}/cancel

POST /api/interviews/{id}/complete

POST /api/interviews/{id}/reschedule

POST /api/interviews/{id}/feedback

---

# Listado

GET debe soportar

page

pageSize

search

candidateId

jobId

recruiterId

status

stage

dateFrom

dateTo

sortBy

sortDirection

---

# Response

Todos los endpoints deben devolver

Result<T>

Formato

{
    success,
    message,
    data
}

---

# DTOs

No exponer entidades.

Crear

ScheduleInterviewRequest

UpdateInterviewRequest

InterviewResponse

InterviewSummaryResponse

InterviewFeedbackRequest

PagedInterviewResponse

---

# Frontend

Crear módulo

features

interviews

---

# Estructura

api

dto

mappers

hooks

components

pages

models

---

# API

interviewApi

Métodos

schedule

update

delete

cancel

complete

reschedule

submitFeedback

getById

getPaged

---

# React Query

Crear

useInterviews

useInterview

useScheduleInterview

useUpdateInterview

useCancelInterview

useCompleteInterview

useRescheduleInterview

useSubmitFeedback

Invalidar queryKeys correspondientes.

---

# Tabla

Reutilizar DataTable.

Columnas

Candidate

Job

Recruiter

Interview Type

Stage

Scheduled Date

Status

Actions

---

# Toolbar

Reutilizar DataTableToolbar.

Debe incluir

Search

Status Filter

Stage Filter

Recruiter Filter

Date Range

Schedule Interview

---

# Formulario

React Hook Form

+

Zod

Campos

Candidate

Job

Recruiter

Interview Type

Interview Stage

Date

Time

Duration

Meeting URL

Location

Description

---

# Página detalle

/interviews/:id

Secciones

Header

Interview Information

Candidate

Job

Recruiter

Feedback

Timeline

Activity

---

# Feedback

Cada entrevista puede tener uno o varios feedbacks.

Entidad

InterviewFeedback

Campos

Id

InterviewId

ReviewerId

TechnicalScore

CommunicationScore

ProblemSolvingScore

CultureFitScore

Comments

Recommendation

CreatedAt

---

# Recommendation

Enum

StrongHire

Hire

Neutral

NoHire

StrongNoHire

---

# Timeline

Registrar

Interview Scheduled

Interview Updated

Interview Rescheduled

Feedback Submitted

Interview Completed

Interview Cancelled

---

# Dashboard

Agregar widgets

Interviews Today

Upcoming Interviews

Completed Interviews

Cancelled Interviews

Average Interview Score

Hiring Funnel

---

# Calendario

Crear vista

/interviews/calendar

Mostrar entrevistas por día.

Inicialmente usar un calendario mensual.

Al hacer clic en una entrevista abrir el detalle.

---

# Estados

Todos los listados deben soportar

Loading

Skeleton

Error

Empty

Success

---

# UI

Reutilizar únicamente

Card

Badge

Dialog

Sheet

AlertDialog

DropdownMenu

Skeleton

Calendar

Date Picker

Time Picker

Input

Textarea

Select

Avatar

No crear componentes nuevos si ya existen.

---

# Calidad

No usar any.

No lógica de negocio en React.

No lógica de negocio en Endpoints.

No Controllers.

No duplicar código.

Usar DTOs.

Usar Mappers.

Usar Domain Models.

Usar Repository Pattern.

Usar Vertical Slice.

Usar Result<T>.

---

# Acceptance Criteria

✓ CRUD completo

✓ Programar entrevista

✓ Reprogramar

✓ Cancelar

✓ Completar

✓ Feedback

✓ Tabla con búsqueda

✓ Filtros

✓ Paginación

✓ Skeletons

✓ Empty State

✓ Página detalle

✓ Calendario

✓ Dashboard Widgets

✓ Arquitectura consistente con Jobs, Candidates y Companies

No introducir nuevas arquitecturas.

No modificar patrones existentes.
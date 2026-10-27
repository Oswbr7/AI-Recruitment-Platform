# EPIC-005 - Analytics Dashboard

## Objetivo

Implementar el Dashboard principal de la plataforma ATS.

El Dashboard debe consumir información de los módulos existentes (Jobs, Candidates, Companies e Interviews) y mostrar métricas, gráficos, KPIs y actividad reciente.

No crear lógica de negocio nueva.

El Dashboard únicamente consume información agregada de otros módulos.

Debe reutilizar exactamente la arquitectura existente.

No modificar patrones.

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

Features

Dashboard

GetDashboardSummary

GetDashboardMetrics

GetHiringFunnel

GetRecentActivity

GetUpcomingInterviews

GetJobsOverview

GetCandidatesOverview

---

# Minimal APIs

No Controllers.

Todos implementan

IEndpoint

Todos registrados automáticamente mediante reflexión.

---

# CQRS

Todos utilizan MediatR.

No acceder al DbContext desde Endpoints.

Flujo obligatorio

Endpoint

↓

MediatR

↓

Pipeline Behaviors

↓

Handler

↓

Repository

↓

EF Core

---

# Validación

Las consultas no requieren FluentValidation salvo parámetros opcionales.

---

# Repositories

No crear un DashboardRepository.

Reutilizar

IJobRepository

ICandidateRepository

IInterviewRepository

ICompanyRepository

Los Handlers agregan la información utilizando los repositorios existentes.

---

# Endpoints

GET /api/dashboard/summary

GET /api/dashboard/jobs

GET /api/dashboard/candidates

GET /api/dashboard/interviews

GET /api/dashboard/activity

GET /api/dashboard/funnel

GET /api/dashboard/charts

---

# Summary

Debe devolver

OpenJobs

PublishedJobs

ClosedJobs

ArchivedJobs

Candidates

Companies

UpcomingInterviews

CompletedInterviews

AverageHiringTime

---

# Dashboard Metrics

Debe devolver

Open Jobs

Total Candidates

Interviews Today

Companies

Average Candidate Score

Hiring Success Rate

Time To Hire

Offers Accepted

---

# Hiring Funnel

Debe devolver

Applied

Screening

Technical Interview

HR Interview

Offer

Hired

Rejected

Cada elemento debe incluir

Stage

Count

Percentage

---

# Jobs Overview

Debe devolver

Published

Draft

Closed

Archived

Top Departments

Top Locations

Most Active Companies

---

# Candidates Overview

Debe devolver

Candidates By Stage

Candidates By Status

Candidates By Experience

Top Skills (placeholder)

Recent Candidates

---

# Interviews Overview

Debe devolver

Today

Tomorrow

This Week

Completed

Cancelled

Average Score

Upcoming

---

# Activity Feed

Crear endpoint

GET /api/dashboard/activity

Debe devolver una lista unificada de eventos provenientes de los diferentes módulos.

Eventos

Candidate Created

Candidate Stage Changed

Job Created

Job Published

Job Archived

Company Created

Interview Scheduled

Interview Completed

Interview Cancelled

Cada evento debe incluir

Id

Type

Title

Description

User

CreatedAt

Icon

Color

---

# DTOs

Crear

DashboardSummaryResponse

DashboardMetricsResponse

DashboardActivityResponse

HiringFunnelResponse

JobsOverviewResponse

CandidatesOverviewResponse

InterviewsOverviewResponse

ChartDataResponse

---

# Frontend

Crear módulo

features/dashboard

---

# Estructura

api

hooks

components

pages

models

---

# API

dashboardApi

Métodos

getSummary()

getMetrics()

getJobs()

getCandidates()

getInterviews()

getHiringFunnel()

getActivity()

getCharts()

---

# React Query

Crear

useDashboardSummary

useDashboardMetrics

useHiringFunnel

useRecentActivity

useJobsOverview

useCandidatesOverview

useInterviewsOverview

Todos utilizando TanStack Query.

---

# Dashboard Layout

Crear una página

/dashboard

Compuesta por

Header

Metrics Grid

Charts

Hiring Funnel

Upcoming Interviews

Recent Activity

Quick Actions

---

# Header

Mostrar

Bienvenida

Fecha actual

Última actualización

Botón Refresh

---

# Metrics Grid

Crear tarjetas reutilizables.

Cada tarjeta

Icono

Título

Valor

Cambio porcentual

Descripción

Color

Widgets

Open Jobs

Candidates

Companies

Upcoming Interviews

Offers

Hires

---

# Charts

Utilizar Recharts.

No utilizar Chart.js.

Crear componentes reutilizables.

Charts

Jobs By Status

Candidates By Stage

Hiring Funnel

Interviews Per Week

Companies By Industry

Hiring Trend

Todos responsivos.

---

# Hiring Funnel

Mostrar

Applied

↓

Screening

↓

Technical

↓

HR

↓

Offer

↓

Hired

Cada etapa

Cantidad

Conversión

Color

---

# Upcoming Interviews

Mostrar

Candidate

Job

Recruiter

Date

Time

Status

Acción

Ver detalle

---

# Recent Activity

Timeline

Mostrar

Icono

Título

Descripción

Usuario

Tiempo relativo

Ejemplo

Candidate moved to Technical Interview

Job published

Interview completed

Company created

---

# Quick Actions

Tarjetas

Create Job

Create Candidate

Schedule Interview

Create Company

---

# Dashboard Widgets

Todos deben ser componentes independientes.

Ejemplo

DashboardMetricCard

DashboardChartCard

DashboardActivityCard

DashboardInterviewCard

DashboardQuickActionCard

DashboardSection

No escribir JSX gigante.

---

# Estados

Todos los widgets soportan

Loading

Skeleton

Error

Empty

Success

Cada widget carga independientemente.

No bloquear todo el Dashboard.

---

# Responsive

Desktop

Tablet

Mobile

Grid responsivo.

---

# Refresh

Agregar botón

Refresh Dashboard

Debe invalidar todas las queries del Dashboard.

---

# Performance

Cada widget debe tener su propia query.

No utilizar un único endpoint gigante.

Las consultas deben ejecutarse en paralelo mediante TanStack Query.

---

# UI

Reutilizar únicamente

Card

Badge

Avatar

Button

DropdownMenu

Skeleton

Separator

Tooltip

Progress

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

Usar React Query.

Usar Result<T>.

Mantener consistencia con el resto de módulos.

---

# Dashboard Charts

Implementar

Jobs By Status

Candidates By Stage

Hiring Funnel

Interviews By Week

Companies By Industry

Hiring Trend (últimos 6 meses)

Todos utilizando Recharts.

---

# Acceptance Criteria

✓ Dashboard completamente funcional

✓ Widgets reutilizables

✓ Métricas

✓ KPIs

✓ Activity Feed

✓ Hiring Funnel

✓ Charts

✓ Upcoming Interviews

✓ Quick Actions

✓ Responsive

✓ Skeletons

✓ Refresh

✓ Arquitectura consistente con el resto del proyecto

No introducir nuevas arquitecturas.

No modificar patrones existentes.
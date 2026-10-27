# EPIC-003 - Company Management

## Objetivo

Implementar el módulo completo de gestión de empresas para la plataforma ATS.

El módulo debe seguir exactamente la misma arquitectura utilizada en Jobs y Candidates.

No modificar la arquitectura existente.

No crear nuevos patrones.

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

Companies

CreateCompany

GetCompanies

GetCompany

UpdateCompany

DeleteCompany

ArchiveCompany

RestoreCompany

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

Crear entidad Company.

No utilizar setters públicos.

Propiedades

Id

Name

LegalName

TaxId

Industry

Website

Email

Phone

Description

LogoUrl

CompanySize

FoundedYear

Country

State

City

Address

PostalCode

Status

CreatedAt

UpdatedAt

Todos los setters privados.

---

# Métodos del dominio

UpdateProfile()

Archive()

Restore()

UpdateLogo()

ChangeStatus()

No modificar propiedades directamente.

---

# Enums

CompanyStatus

Active

Archived

CompanySize

Startup

Small

Medium

Large

Enterprise

Industry

Technology

Finance

Healthcare

Retail

Education

Manufacturing

Government

Other

---

# Relaciones

Una Company puede tener

Muchos Jobs

Muchos Recruiters

Muchos Contacts

No implementar navegación circular innecesaria.

---

# Repository

Crear

ICompanyRepository

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

CompanyConfiguration

Usar IEntityTypeConfiguration.

No DataAnnotations.

Configurar

Longitudes

Índices

Restricciones

Unique Index

Website opcional

Logo opcional

---

# Endpoints

POST /api/companies

GET /api/companies

GET /api/companies/{id}

PUT /api/companies/{id}

DELETE /api/companies/{id}

POST /api/companies/{id}/archive

POST /api/companies/{id}/restore

---

# Listado

GET debe soportar

page

pageSize

search

industry

status

country

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

CreateCompanyRequest

UpdateCompanyRequest

CompanyResponse

CompanySummaryResponse

PagedCompanyResponse

---

# Frontend

Crear módulo

features

companies

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

companyApi

Métodos

create

update

delete

archive

restore

getById

getPaged

---

# React Query

Crear

useCompanies

useCompany

useCreateCompany

useUpdateCompany

useDeleteCompany

useArchiveCompany

useRestoreCompany

Invalidar queryKeys correspondientes.

---

# Tabla

Reutilizar DataTable.

Columnas

Logo

Name

Industry

Company Size

Country

Open Jobs

Status

Updated

Actions

---

# Toolbar

Reutilizar DataTableToolbar.

Debe incluir

Search

Industry Filter

Status Filter

Country Filter

Create Company

---

# Formulario

React Hook Form

+

Zod

Campos

Name

Legal Name

Tax ID

Industry

Website

Email

Phone

Description

Logo

Company Size

Founded Year

Country

State

City

Address

Postal Code

---

# Página detalle

/company/:id

Secciones

Header

Overview

Open Jobs

Recruiters

Contacts

Activity

Timeline

---

# Open Jobs

Mostrar todas las vacantes asociadas.

Reutilizar JobTable.

No duplicar componentes.

---

# Contacts

Cada empresa puede tener múltiples contactos.

Entidad

CompanyContact

Campos

First Name

Last Name

Email

Phone

Position

Primary Contact

Acciones

Create

Update

Delete

---

# Recruiters

Mostrar los recruiters pertenecientes a la empresa.

Placeholder inicialmente.

La arquitectura debe quedar preparada.

---

# Timeline

Registrar

Company Created

Company Updated

Job Created

Job Archived

Recruiter Invited

Contact Added

---

# Dashboard

Agregar widget

Top Companies

Companies by Industry

Companies by Size

Active Companies

Archived Companies

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

✓ Tabla con búsqueda

✓ Filtros

✓ Paginación

✓ Skeletons

✓ Empty State

✓ Detail Page

✓ Contacts

✓ Timeline

✓ Open Jobs

✓ Dashboard Widgets

✓ Arquitectura consistente con Jobs y Candidates

No introducir nuevas arquitecturas.

No modificar patrones existentes.
# ---------- Build ----------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY . .

RUN dotnet restore services/job-service/src/JobService.Api/JobService.Api.csproj

RUN dotnet publish services/job-service/src/JobService.Api/JobService.Api.csproj \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false


# ---------- Migrations ----------
# EF Core migrations bundle: ejecutable autocontenido con las migraciones
# del servicio. Lo corre el Job de migracion de Kubernetes
# (Infraestructure/kubernetes) para aplicar el esquema ANTES de la API —
# en Production las migraciones automaticas estan desactivadas por diseno
# (docs/architecture.md §9).
FROM build AS migrations
RUN dotnet tool restore && \
    dotnet ef migrations bundle \
        --project services/job-service/src/JobService.Infrastructure/JobService.Infrastructure.csproj \
        --startup-project services/job-service/src/JobService.Api/JobService.Api.csproj \
        -r linux-x64 --self-contained -o /app/migrate


# ---------- Runtime ----------
FROM mcr.microsoft.com/dotnet/aspnet:10.0

WORKDIR /app

COPY --from=build /app/publish .
COPY --from=migrations /app/migrate .

RUN mkdir -p /app/logs && chown -R $APP_UID:$APP_UID /app

USER $APP_UID

EXPOSE 8080

ENTRYPOINT ["dotnet","JobService.Api.dll"]

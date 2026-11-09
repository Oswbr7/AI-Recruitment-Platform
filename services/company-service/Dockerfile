# ---------- Build ----------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY . .

RUN dotnet restore services/company-service/src/CompanyService.Api/CompanyService.Api.csproj

RUN dotnet publish services/company-service/src/CompanyService.Api/CompanyService.Api.csproj \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false


# ---------- Migrations ----------
# EF Core migrations bundle: ejecutable autocontenido con las migraciones
# del servicio. Lo corre el Job de migracion de Kubernetes
# (infrastructure/kubernetes) para aplicar el esquema ANTES de la API —
# en Production las migraciones automaticas estan desactivadas por diseno
# (docs/architecture.md §9).
FROM build AS migrations
RUN dotnet tool restore && \
    dotnet ef migrations bundle \
        --project services/company-service/src/CompanyService.Infrastructure/CompanyService.Infrastructure.csproj \
        --startup-project services/company-service/src/CompanyService.Api/CompanyService.Api.csproj \
        -r linux-x64 --self-contained -o /app/migrate


# ---------- Runtime ----------
FROM mcr.microsoft.com/dotnet/aspnet:10.0

WORKDIR /app

COPY --from=build /app/publish .
COPY --from=migrations /app/migrate .

RUN mkdir -p /app/logs && chown -R $APP_UID:$APP_UID /app

USER $APP_UID

EXPOSE 8080

ENTRYPOINT ["dotnet","CompanyService.Api.dll"]

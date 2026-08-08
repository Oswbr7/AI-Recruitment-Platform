# ---------- Build ----------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY . .

RUN dotnet restore services/job-service/src/JobService.Api/JobService.Api.csproj

RUN dotnet publish services/job-service/src/JobService.Api/JobService.Api.csproj \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false


# ---------- Runtime ----------
FROM mcr.microsoft.com/dotnet/aspnet:10.0

WORKDIR /app

COPY --from=build /app/publish .

RUN mkdir -p /app/logs && chown -R $APP_UID:$APP_UID /app

USER $APP_UID

EXPOSE 8080

ENTRYPOINT ["dotnet","JobService.Api.dll"]

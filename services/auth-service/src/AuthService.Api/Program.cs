using AuthService.Api.Endpoints;
using AuthService.Application;
using AuthService.Infrastructure;
using AuthService.Infrastructure.Persistence;
using BuildingBlocks.Infrastructure.Extensions;
using BuildingBlocks.Infrastructure.Health;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.AddPlatformInfrastructure("AuthService");

// Enums como string en el JSON (igual que los otros 4 servicios — sin esto,
// el body { "role": "Recruiter" } del PATCH de rol no liga y devuelve 400).
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
    await app.MigrateDatabaseAsync<AppDbContext>();

app.UsePlatformInfrastructure();

app.MapEndpoints();

app.MapPlatformHealthChecks();

app.Run();

// Expone el Program de top-level statements a WebApplicationFactory
// (tests de integracion en AuthService.IntegrationTests).
public partial class Program;

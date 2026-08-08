using AuthService.Api.Endpoints;
using AuthService.Application;
using AuthService.Infrastructure;
using AuthService.Infrastructure.Persistence;
using BuildingBlocks.Infrastructure.Extensions;
using BuildingBlocks.Infrastructure.Health;

var builder = WebApplication.CreateBuilder(args);

builder.AddPlatformInfrastructure("AuthService");

builder.Services.AddControllers();

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
    await app.MigrateDatabaseAsync<AppDbContext>();

app.UsePlatformInfrastructure();

app.MapControllers();

app.MapEndpoints();

app.MapPlatformHealthChecks();

app.Run();

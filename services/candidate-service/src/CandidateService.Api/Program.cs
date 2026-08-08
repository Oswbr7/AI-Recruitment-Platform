using BuildingBlocks.Infrastructure.Extensions;
using BuildingBlocks.Infrastructure.Health;
using CandidateService.Api.Endpoints;
using CandidateService.Application;
using CandidateService.Infrastructure;
using CandidateService.Infrastructure.Persistence;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.AddPlatformInfrastructure("CandidateService");

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
    await app.MigrateDatabaseAsync<ApplicationDbContext>();

app.UsePlatformInfrastructure();

app.MapEndpoints();

app.MapPlatformHealthChecks();

app.Run();

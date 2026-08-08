using System.Threading.RateLimiting;
using BuildingBlocks.Infrastructure.Compression;
using BuildingBlocks.Infrastructure.Configuration;
using BuildingBlocks.Infrastructure.Health;
using BuildingBlocks.Infrastructure.Logging;
using BuildingBlocks.Infrastructure.Middlewares;
using BuildingBlocks.Infrastructure.Options;
using BuildingBlocks.Infrastructure.Security;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi;
using Serilog;

namespace BuildingBlocks.Infrastructure.Extensions;

public static class WebApplicationBuilderExtensions
{
    /// <summary>
    /// Wires the cross-cutting concerns shared by every service: Serilog, validated Options,
    /// health checks scaffolding, ProblemDetails + global exception handling, JWT auth, CORS,
    /// rate limiting, response compression, and Swagger with a JWT bearer scheme.
    /// Named "Platform" (not "Infrastructure") to avoid colliding with each service's own
    /// existing Infrastructure.DependencyInjection.AddInfrastructure() (EF Core + repositories).
    /// </summary>
    public static WebApplicationBuilder AddPlatformInfrastructure(
        this WebApplicationBuilder builder,
        string serviceName)
    {
        var configuration = builder.Configuration;

        builder.Services.AddEndpointsApiExplorer();

        builder.Host.UseSerilog((context, _, loggerConfig) =>
            SerilogConfiguration.Configure(loggerConfig, context.Configuration, serviceName));

        builder.Services.AddValidatedOptions<JwtOptions>(configuration, JwtOptions.SectionName);
        builder.Services.AddValidatedOptions<CorsOptions>(configuration, CorsOptions.SectionName);
        builder.Services.AddValidatedOptions<SwaggerOptions>(configuration, SwaggerOptions.SectionName);
        builder.Services.AddValidatedOptions<RateLimitOptions>(configuration, RateLimitOptions.SectionName);
        // StorageOptions intentionally NOT registered here — unused placeholder for a future feature.

        builder.Services.AddPlatformHealthChecks();

        builder.Services.AddProblemDetails();
        builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

        builder.Services.AddPlatformJwtAuthentication(configuration);
        builder.Services.AddAuthorization();

        var corsOptions = configuration.GetSection(CorsOptions.SectionName).Get<CorsOptions>() ?? new CorsOptions();

        builder.Services.AddCors(options =>
            options.AddPolicy(corsOptions.PolicyName, policy =>
                policy
                    .WithOrigins(corsOptions.AllowedOrigins)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()));

        var rateLimitOptions = configuration.GetSection(RateLimitOptions.SectionName).Get<RateLimitOptions>() ?? new RateLimitOptions();

        builder.Services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
                RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = rateLimitOptions.PermitLimit,
                        Window = TimeSpan.FromSeconds(rateLimitOptions.WindowSeconds),
                        QueueLimit = rateLimitOptions.QueueLimit,
                    }));
        });

        builder.Services.AddPlatformResponseCompression();

        var swaggerOptions = configuration.GetSection(SwaggerOptions.SectionName).Get<SwaggerOptions>()
            ?? new SwaggerOptions { Title = serviceName };

        builder.Services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc(swaggerOptions.Version, new OpenApiInfo
            {
                Title = swaggerOptions.Title,
                Version = swaggerOptions.Version,
                Description = swaggerOptions.Description,
            });

            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Enter your JWT token.",
            });

            options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
            {
                { new OpenApiSecuritySchemeReference("Bearer", document), new List<string>() },
            });
        });

        return builder;
    }
}

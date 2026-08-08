using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace BuildingBlocks.Infrastructure.Health;

public static class HealthCheckExtensions
{
    public static IHealthChecksBuilder AddPlatformHealthChecks(this IServiceCollection services) =>
        services
            .AddHealthChecks()
            .AddCheck("self", () => HealthCheckResult.Healthy(), tags: ["live"]);

    /// <summary>
    /// Called from each service's own Infrastructure.DependencyInjection, alongside its AddDbContext call,
    /// so the real Postgres connectivity check lives with the per-service DB wiring.
    /// </summary>
    public static IHealthChecksBuilder AddPlatformDatabaseCheck(this IHealthChecksBuilder builder, string connectionString) =>
        builder.AddNpgSql(connectionString, name: "postgres", tags: ["ready"]);

    public static WebApplication MapPlatformHealthChecks(this WebApplication app)
    {
        app.MapHealthChecks("/health");

        app.MapHealthChecks("/health/live", new HealthCheckOptions
        {
            Predicate = check => check.Tags.Contains("live"),
        });

        app.MapHealthChecks("/health/ready", new HealthCheckOptions
        {
            Predicate = check => check.Tags.Contains("ready"),
        });

        return app;
    }
}

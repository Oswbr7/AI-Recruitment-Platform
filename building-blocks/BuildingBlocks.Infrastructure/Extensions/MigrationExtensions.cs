using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace BuildingBlocks.Infrastructure.Extensions;

public static class MigrationExtensions
{
    /// <summary>
    /// Applies EF Core migrations. Callers must gate this behind an environment check
    /// (only Development) — production migrations are a manual/CI concern, never automatic.
    /// </summary>
    public static async Task<WebApplication> MigrateDatabaseAsync<TContext>(this WebApplication app)
        where TContext : DbContext
    {
        using var scope = app.Services.CreateScope();

        var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DatabaseMigrator");
        var context = scope.ServiceProvider.GetRequiredService<TContext>();

        logger.LogInformation("Applying database migrations for {ContextType}", typeof(TContext).Name);

        await context.Database.MigrateAsync();

        logger.LogInformation("Database migrations applied for {ContextType}", typeof(TContext).Name);

        return app;
    }
}

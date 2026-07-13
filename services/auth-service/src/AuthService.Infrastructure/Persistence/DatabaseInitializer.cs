using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace AuthService.Infrastructure.Persistence;

public static class DatabaseInitializer
{
    public static async Task InitializeAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();

        var logger = scope.ServiceProvider
            .GetRequiredService<ILoggerFactory>()
            .CreateLogger("DatabaseInitializer");

        var context = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        logger.LogInformation("Applying database migrations...");

        await context.Database.MigrateAsync();

        logger.LogInformation("Database is up to date.");
    }
}
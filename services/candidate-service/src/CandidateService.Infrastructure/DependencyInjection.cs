using BuildingBlocks.Infrastructure.Health;
using CandidateService.Domain.Repositories;
using CandidateService.Infrastructure.Persistence;
using CandidateService.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CandidateService.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString =
            configuration.GetConnectionString("DefaultConnection")
            ?? configuration.GetConnectionString("Postgres")
            ?? throw new InvalidOperationException("No connection string configured (DefaultConnection/Postgres).");

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseNpgsql(connectionString);
        });

        services.AddScoped<ICandidateRepository, CandidateRepository>();
        services.AddScoped<ICandidateNoteRepository, CandidateNoteRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddHealthChecks().AddPlatformDatabaseCheck(connectionString);

        return services;
    }
}

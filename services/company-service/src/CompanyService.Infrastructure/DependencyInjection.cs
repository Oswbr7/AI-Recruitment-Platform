using BuildingBlocks.Infrastructure.Health;
using CompanyService.Domain.Repositories;
using CompanyService.Infrastructure.Persistence;
using CompanyService.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CompanyService.Infrastructure;

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

        services.AddScoped<ICompanyRepository, CompanyRepository>();
        services.AddScoped<ICompanyContactRepository, CompanyContactRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddHealthChecks().AddPlatformDatabaseCheck(connectionString);

        return services;
    }
}

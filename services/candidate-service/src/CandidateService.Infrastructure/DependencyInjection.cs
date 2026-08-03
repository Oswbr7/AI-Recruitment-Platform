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
        services.AddDbContext<ApplicationDbContext>(options =>
        {
            var connectionString =
                configuration.GetConnectionString("DefaultConnection")
                ?? configuration.GetConnectionString("Postgres");

            options.UseNpgsql(connectionString);
        });

        services.AddScoped<ICandidateRepository, CandidateRepository>();
        services.AddScoped<ICandidateNoteRepository, CandidateNoteRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}

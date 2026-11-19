using JobService.Infrastructure.Persistence;
using BuildingBlocks.Infrastructure.Options;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace JobService.IntegrationTests;

/// <summary>
/// Levanta job-service REAL sobre TestServer con:
/// - EF Core InMemory (base de datos aislada por fábrica, sin Docker)
/// - environment "Integration" (las migraciones automáticas solo corren en
///   Development, que requeriría Postgres)
/// - configuración JWT en memoria (los valores reales viven en
///   appsettings.Development.json, que no aplica fuera de Development)
///
/// Cada test crea su propia fábrica: la regla "primer usuario = Admin" hace
/// que el estado compartido entre tests rompa el aislamiento.
/// </summary>
public sealed class JobServiceApiFactory : WebApplicationFactory<Program>
{
    // Nombre de base unico por instancia: aislado de otras factories del
    // mismo proceso. (InMemoryDatabaseRoot se elimino en EF Core 10; el
    // nombre unico es el mecanismo vigente.)
    private readonly string _databaseName = $"job-it-{Guid.NewGuid()}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Integration");

        // UseSetting fluye al app configuration via la host configuration
        // (los valores reales viven en appsettings.Development.json, que no
        // aplica fuera de Development). Config Jwt completa + CORS minimo.
        builder.UseSetting($"Jwt:{nameof(JwtOptions.Key)}", "IntegrationTestSecretKey_Min32Chars!");
        builder.UseSetting($"Jwt:{nameof(JwtOptions.Issuer)}", "RecruitmentPlatform");
        builder.UseSetting($"Jwt:{nameof(JwtOptions.Audience)}", "RecruitmentPlatform");
        builder.UseSetting($"Cors:{nameof(CorsOptions.AllowedOrigins)}:0", "http://localhost:5173");
        // AddInfrastructure falla sin connection string (fail-fast). Da un
        // dummy: el DbContext Npgsql se reemplaza por InMemory abajo y el
        // health check NpgSql nunca se invoca en estos tests.
        builder.UseSetting("ConnectionStrings:DefaultConnection",
            "Host=localhost;Port=5432;Database=unused;Username=unused;Password=unused");

        builder.ConfigureServices(services =>
        {
            // Reemplaza el DbContext Npgsql por uno InMemory. Hay que quitar
            // TRES cosas del registro original (AddInfrastructure):
            //   1. DbContextOptions<ApplicationDbContext>
            //   2. la configuracion de options del provider (sin esto EF
            //      detecta Npgsql + InMemory juntos y lanza
            //      InvalidOperationException -> HTTP 409 vía el exception
            //      handler, un error muy confuso de diagnosticar)
            //   3. el DbContext mismo
            services.RemoveAll<DbContextOptions<ApplicationDbContext>>();
            RemoveOptionsConfiguration(services);
            services.RemoveAll<ApplicationDbContext>();
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseInMemoryDatabase(_databaseName));
        });
    }

    private static void RemoveOptionsConfiguration(IServiceCollection services)
    {
        // IDbContextOptionsConfiguration<TContext> no es accesible publicamente
        // en EF 10: se localiza por nombre de tipo generico.
        var descriptors = services
            .Where(d =>
                d.ServiceType.IsGenericType &&
                d.ServiceType.GetGenericTypeDefinition().Name == "IDbContextOptionsConfiguration`1" &&
                d.ServiceType.GenericTypeArguments[0] == typeof(ApplicationDbContext))
            .ToList();

        foreach (var descriptor in descriptors)
            services.Remove(descriptor);
    }
}

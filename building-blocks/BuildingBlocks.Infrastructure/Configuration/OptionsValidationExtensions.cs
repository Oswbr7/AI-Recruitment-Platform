using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BuildingBlocks.Infrastructure.Configuration;

public static class OptionsValidationExtensions
{
    /// <summary>
    /// Binds, validates (data annotations), and fails fast on startup (ValidateOnStart) —
    /// so missing/invalid config crashes the app immediately instead of failing on first use.
    /// </summary>
    public static IServiceCollection AddValidatedOptions<TOptions>(
        this IServiceCollection services,
        IConfiguration configuration,
        string sectionName)
        where TOptions : class
    {
        services
            .AddOptions<TOptions>()
            .Bind(configuration.GetSection(sectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        return services;
    }
}

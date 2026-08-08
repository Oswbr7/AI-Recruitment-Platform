using System.ComponentModel.DataAnnotations;

namespace BuildingBlocks.Infrastructure.Options;

public sealed class CorsOptions
{
    public const string SectionName = "Cors";

    public string PolicyName { get; init; } = "frontend";

    [Required, MinLength(1)]
    public string[] AllowedOrigins { get; init; } = [];
}

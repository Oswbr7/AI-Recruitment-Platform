using System.ComponentModel.DataAnnotations;

namespace BuildingBlocks.Infrastructure.Options;

public sealed class SwaggerOptions
{
    public const string SectionName = "Swagger";

    [Required]
    public string Title { get; init; } = "Service API";

    public string Version { get; init; } = "v1";

    public string Description { get; init; } = string.Empty;
}

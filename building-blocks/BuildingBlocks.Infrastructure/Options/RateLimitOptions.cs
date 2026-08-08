using System.ComponentModel.DataAnnotations;

namespace BuildingBlocks.Infrastructure.Options;

public sealed class RateLimitOptions
{
    public const string SectionName = "RateLimit";

    [Range(1, int.MaxValue)]
    public int PermitLimit { get; init; } = 100;

    [Range(1, int.MaxValue)]
    public int WindowSeconds { get; init; } = 60;

    [Range(0, int.MaxValue)]
    public int QueueLimit { get; init; } = 0;
}

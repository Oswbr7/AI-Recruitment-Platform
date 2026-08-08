namespace BuildingBlocks.Infrastructure.Options;

/// <summary>
/// Reserved for a future file/blob storage feature. Not consumed anywhere yet — scaffold only,
/// mirroring how OpenTelemetry/Prometheus/Tracing are prepared-but-not-wired in this epic.
/// </summary>
public sealed class StorageOptions
{
    public const string SectionName = "Storage";

    public string Provider { get; init; } = string.Empty;

    public string ConnectionString { get; init; } = string.Empty;

    public string ContainerName { get; init; } = string.Empty;
}

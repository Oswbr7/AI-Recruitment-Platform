namespace BuildingBlocks.Infrastructure.Options;

/// <summary>
/// Not bound directly from a single config section — connection strings live under the flat
/// "ConnectionStrings" key with a per-service fallback chain (DefaultConnection, then Postgres).
/// Populated manually by each service's own Infrastructure.DependencyInjection and validated there.
/// </summary>
public sealed class DatabaseOptions
{
    public required string ConnectionString { get; init; }
}

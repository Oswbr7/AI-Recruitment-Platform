using Microsoft.Extensions.Configuration;
using Serilog;

namespace BuildingBlocks.Infrastructure.Logging;

public static class SerilogConfiguration
{
    public static void Configure(
        LoggerConfiguration loggerConfig,
        IConfiguration configuration,
        string serviceName)
    {
        loggerConfig
            .ReadFrom.Configuration(configuration)
            .Enrich.FromLogContext()
            .Enrich.WithProperty("Service", serviceName)
            .Enrich.WithEnvironmentName()
            .Enrich.WithThreadId()
            .WriteTo.Console(
                outputTemplate:
                    "[{Timestamp:HH:mm:ss} {Level:u3}] ({Service}) {CorrelationId} {Message:lj}{NewLine}{Exception}")
            .WriteTo.File(
                path: $"logs/{serviceName.ToLowerInvariant()}-.log",
                rollingInterval: RollingInterval.Day,
                retainedFileCountLimit: 14,
                outputTemplate:
                    "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] ({Service}) {CorrelationId} {Message:lj}{NewLine}{Exception}");

        // Seq sink — prepared but not wired, per the epic ("preparar, no implementar").
        // Uncomment once a Seq server exists and add the Serilog.Sinks.Seq package reference:
        // .WriteTo.Seq(configuration["Serilog:SeqServerUrl"] ?? "http://localhost:5341");
    }
}

using Microsoft.AspNetCore.Http;
using Serilog.Context;

namespace BuildingBlocks.Infrastructure.Correlation;

public static class CorrelationIdDefaults
{
    public const string HeaderName = "X-Correlation-Id";
}

public sealed class CorrelationIdMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId =
            context.Request.Headers.TryGetValue(CorrelationIdDefaults.HeaderName, out var existing) &&
            !string.IsNullOrWhiteSpace(existing)
                ? existing.ToString()
                : Guid.NewGuid().ToString();

        context.Response.Headers[CorrelationIdDefaults.HeaderName] = correlationId;

        using (LogContext.PushProperty("CorrelationId", correlationId))
        {
            await next(context);
        }
    }
}

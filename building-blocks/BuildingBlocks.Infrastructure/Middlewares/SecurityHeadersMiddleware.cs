using Microsoft.AspNetCore.Http;

namespace BuildingBlocks.Infrastructure.Middlewares;

public sealed class SecurityHeadersMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var headers = context.Response.Headers;

        headers["X-Content-Type-Options"] = "nosniff";
        headers["X-Frame-Options"] = "DENY";
        headers["Referrer-Policy"] = "no-referrer";
        headers["Content-Security-Policy"] = "default-src 'self'";
        headers["X-XSS-Protection"] = "0"; // deprecated header, explicitly disabled per OWASP guidance

        // Strict-Transport-Security intentionally omitted here — HSTS only makes sense behind a
        // TLS-terminating ingress/load balancer, which belongs to the future Kubernetes epic.

        await next(context);
    }
}

using BuildingBlocks.Infrastructure.Correlation;
using BuildingBlocks.Infrastructure.Middlewares;
using BuildingBlocks.Infrastructure.Options;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace BuildingBlocks.Infrastructure.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication UsePlatformInfrastructure(this WebApplication app)
    {
        // CorrelationIdMiddleware must wrap UseSerilogRequestLogging (not the other way around) —
        // otherwise the CorrelationId LogContext property is popped before the request-completion
        // log line is written, and that line ends up missing the correlation id.
        app.UseMiddleware<CorrelationIdMiddleware>();

        app.UseSerilogRequestLogging();

        app.UseExceptionHandler();

        app.UseMiddleware<SecurityHeadersMiddleware>();

        app.UseHttpsRedirection();

        app.UseResponseCompression();

        var corsOptions = app.Configuration.GetSection(CorsOptions.SectionName).Get<CorsOptions>() ?? new CorsOptions();
        app.UseCors(corsOptions.PolicyName);

        app.UseRateLimiter();

        app.UseAuthentication();
        app.UseAuthorization();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        return app;
    }
}

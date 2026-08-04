using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace InterviewService.Api.Common.Exceptions;

public sealed class GlobalExceptionHandler
    : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(
        ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(
            exception,
            "Exception occurred: {Message}",
            exception.Message);

        ProblemDetails problemDetails;

        switch (exception)
        {
            case ValidationException validationException:

                problemDetails = new ValidationProblemDetails(
                    validationException.Errors
                        .GroupBy(e => e.PropertyName)
                        .ToDictionary(
                            g => g.Key,
                            g => g
                                .Select(e => e.ErrorMessage)
                                .ToArray()))
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Validation failed"
                };

                break;

            case InvalidOperationException invalidOperationException:

                problemDetails = new ProblemDetails
                {
                    Status = StatusCodes.Status409Conflict,
                    Title = "Invalid operation",
                    Detail = invalidOperationException.Message
                };

                break;

            default:

                problemDetails = new ProblemDetails
                {
                    Status = StatusCodes.Status500InternalServerError,
                    Title = "Internal Server Error",
                    Detail = exception.Message
                };

                break;
        }

        httpContext.Response.StatusCode =
            problemDetails.Status ?? 500;

        await httpContext.Response.WriteAsJsonAsync(
            problemDetails,
            cancellationToken);

        return true;
    }
}

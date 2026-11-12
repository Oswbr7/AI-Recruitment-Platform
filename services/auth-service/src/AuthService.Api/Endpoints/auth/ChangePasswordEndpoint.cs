using System.Security.Claims;
using AuthService.Application.Features.Auth.Commands;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace AuthService.Api.Endpoints.Auth;

public sealed class ChangePasswordEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/auth/change-password", Handle)
            .WithName("ChangePassword")
            .WithTags("Auth")
            // Requiere sesion: cualquier usuario autenticado cambia SU password
            // (el user id sale del claim "sub" del JWT, no del body).
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        ChangePasswordRequest request,
        ClaimsPrincipal principal,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(
            principal.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? principal.FindFirstValue("sub")
                ?? throw new InvalidOperationException("El JWT no contiene el claim 'sub'."));

        var result = await sender.Send(
            new ChangePasswordCommand(userId, request.CurrentPassword, request.NewPassword),
            cancellationToken);

        if (result.IsFailure)
            return Results.Json(
                Result.Failure(result.Error.Description),
                statusCode: StatusCodes.Status400BadRequest);

        return Results.Ok(Result.Ok("Password updated."));
    }
}

public sealed record ChangePasswordRequest(
    string CurrentPassword,
    string NewPassword);

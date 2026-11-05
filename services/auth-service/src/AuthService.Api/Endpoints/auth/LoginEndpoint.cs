using AuthService.Application.Features.Auth.Commands;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace AuthService.Api.Endpoints.Auth;

public sealed class LoginEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/auth/login", Handle)
            .WithName("Login")
            .WithTags("Auth");
    }

    private static async Task<IResult> Handle(
        LoginCommand command,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(command, cancellationToken);

        if (result.IsFailure)
            return Results.Json(
                Result.Failure(result.Error.Description),
                statusCode: StatusCodes.Status401Unauthorized);

        // Se devuelve el DTO directo (sin envelope) porque es el contrato que
        // el frontend espera: { accessToken, expiresAt, user }.
        return Results.Ok(result.Value);
    }
}

using AuthService.Application.Features.Auth.Commands;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace AuthService.Api.Endpoints.Auth;

public sealed class RegisterEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/auth/register", Handle)
            .WithName("Register")
            .WithTags("Auth");
    }

    private static async Task<IResult> Handle(
        RegisterUserCommand command,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(command, cancellationToken);

        if (result.IsFailure)
            return Results.Conflict(Result.Failure(result.Error.Description));

        return Results.Ok(Result<Guid>.Ok(result.Value));
    }
}

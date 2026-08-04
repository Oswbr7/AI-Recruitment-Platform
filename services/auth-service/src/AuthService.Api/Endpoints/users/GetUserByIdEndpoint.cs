using AuthService.Api.Common.Results;
using AuthService.Application.Features.Users.GetUserById;
using AuthService.Application.Features.Users.GetUsers;
using MediatR;

namespace AuthService.Api.Endpoints.Users;

public sealed class GetUserByIdEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/users/{id:guid}", Handle)
            .WithName("GetUserById")
            .WithTags("Users")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new GetUserByIdQuery(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("User not found."));

        return Results.Ok(Result<UserResponse>.Ok(response));
    }
}

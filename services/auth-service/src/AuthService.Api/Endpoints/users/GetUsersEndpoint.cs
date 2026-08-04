using AuthService.Api.Common.Results;
using AuthService.Application.Features.Users.GetUsers;
using AuthService.Domain.Enums;
using MediatR;

namespace AuthService.Api.Endpoints.Users;

public sealed class GetUsersEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/users", Handle)
            .WithName("GetUsers")
            .WithTags("Users")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        ISender sender,
        CancellationToken cancellationToken,
        string? role = null)
    {
        Enum.TryParse<UserRole>(role, true, out var parsedRole);

        var response = await sender.Send(
            new GetUsersQuery(string.IsNullOrWhiteSpace(role) ? null : parsedRole),
            cancellationToken);

        return Results.Ok(Result<List<UserResponse>>.Ok(response));
    }
}

using AuthService.Application.Features.Users.GetUsers;
using AuthService.Domain.Enums;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace AuthService.Api.Endpoints.Users;

public sealed class GetUsersEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/users", Handle)
            .WithName("GetUsers")
            .WithTags("Users")
            // El directorio de usuarios lo consumen el admin de usuarios
            // (Admin) y el scheduling de entrevistas (Recruiter). El rol
            // Candidate queda fuera: no enumera usuarios.
            .RequireAuthorization(policy =>
                policy.RequireRole(nameof(UserRole.Admin), nameof(UserRole.Recruiter)));
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

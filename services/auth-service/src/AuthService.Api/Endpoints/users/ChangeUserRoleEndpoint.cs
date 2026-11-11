using AuthService.Application.Features.Users.ChangeRole;
using AuthService.Application.Features.Users.GetUsers;
using AuthService.Domain.Enums;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace AuthService.Api.Endpoints.Users;

public sealed class ChangeUserRoleEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch("/api/users/{id:guid}/role", Handle)
            .WithName("ChangeUserRole")
            .WithTags("Users")
            // Solo Admin puede cambiar roles (el claim "role" del JWT viaja
            // como string: "Admin" | "Recruiter" | "Candidate").
            .RequireAuthorization(policy =>
                policy.RequireRole(nameof(UserRole.Admin)));
    }

    private static async Task<IResult> Handle(
        Guid id,
        ChangeUserRoleRequest request,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new ChangeUserRoleCommand(id, request.Role),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("User not found."));

        return Results.Ok(Result<UserResponse>.Ok(response));
    }
}

public sealed record ChangeUserRoleRequest(UserRole Role);

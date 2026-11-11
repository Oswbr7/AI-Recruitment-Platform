using AuthService.Domain.Enums;
using AuthService.Application.Features.Users.GetUsers;
using MediatR;

namespace AuthService.Application.Features.Users.ChangeRole;

public sealed record ChangeUserRoleCommand(
    Guid Id,
    UserRole Role
) : IRequest<UserResponse?>;

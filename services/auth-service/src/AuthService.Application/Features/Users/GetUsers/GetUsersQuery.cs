using AuthService.Domain.Enums;
using MediatR;

namespace AuthService.Application.Features.Users.GetUsers;

public sealed record GetUsersQuery(UserRole? Role) : IRequest<List<UserResponse>>;

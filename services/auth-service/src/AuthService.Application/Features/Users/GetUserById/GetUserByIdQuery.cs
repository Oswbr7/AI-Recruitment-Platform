using AuthService.Application.Features.Users.GetUsers;
using MediatR;

namespace AuthService.Application.Features.Users.GetUserById;

public sealed record GetUserByIdQuery(Guid Id) : IRequest<UserResponse?>;

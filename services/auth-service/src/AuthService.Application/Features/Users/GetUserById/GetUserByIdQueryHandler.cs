using AuthService.Application.Abstractions.Persistence;
using AuthService.Application.Features.Users.Common;
using AuthService.Application.Features.Users.GetUsers;
using MediatR;

namespace AuthService.Application.Features.Users.GetUserById;

public sealed class GetUserByIdQueryHandler
    : IRequestHandler<GetUserByIdQuery, UserResponse?>
{
    private readonly IUserRepository _users;

    public GetUserByIdQueryHandler(IUserRepository users)
    {
        _users = users;
    }

    public async Task<UserResponse?> Handle(
        GetUserByIdQuery request,
        CancellationToken cancellationToken)
    {
        var user = await _users.GetByIdAsync(request.Id);

        return user?.ToResponse();
    }
}

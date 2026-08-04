using AuthService.Application.Abstractions.Persistence;
using AuthService.Application.Features.Users.Common;
using MediatR;

namespace AuthService.Application.Features.Users.GetUsers;

public sealed class GetUsersQueryHandler
    : IRequestHandler<GetUsersQuery, List<UserResponse>>
{
    private readonly IUserRepository _users;

    public GetUsersQueryHandler(IUserRepository users)
    {
        _users = users;
    }

    public async Task<List<UserResponse>> Handle(
        GetUsersQuery request,
        CancellationToken cancellationToken)
    {
        var users = await _users.GetAllAsync();

        if (request.Role.HasValue)
            users = users.Where(x => x.Role == request.Role.Value).ToList();

        return users.Select(x => x.ToResponse()).ToList();
    }
}

using AuthService.Application.Abstractions.Persistence;
using AuthService.Application.Features.Users.Common;
using AuthService.Application.Features.Users.GetUsers;
using MediatR;

namespace AuthService.Application.Features.Users.ChangeRole;

public sealed class ChangeUserRoleHandler
    : IRequestHandler<ChangeUserRoleCommand, UserResponse?>
{
    private readonly IUserRepository _users;
    private readonly IUnitOfWork _unitOfWork;

    public ChangeUserRoleHandler(
        IUserRepository users,
        IUnitOfWork unitOfWork)
    {
        _users = users;
        _unitOfWork = unitOfWork;
    }

    public async Task<UserResponse?> Handle(
        ChangeUserRoleCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _users.GetByIdAsync(request.Id);

        if (user is null)
            return null;

        user.Role = request.Role;

        await _users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return user.ToResponse();
    }
}

using AuthService.Application.Abstractions.Persistence;
using AuthService.Application.Abstractions.Security;
using AuthService.Application.Common.Errors;
using AuthService.Application.Features.Auth.Commands;
using BuildingBlocks.Application.Common.Errors;
using MediatR;

namespace AuthService.Application.Features.Auth.ChangePassword;

public sealed class ChangePasswordHandler
    : IRequestHandler<ChangePasswordCommand, Result>
{
    private readonly IUserRepository _users;
    private readonly IPasswordHasher _hasher;
    private readonly IUnitOfWork _unitOfWork;

    public ChangePasswordHandler(
        IUserRepository users,
        IPasswordHasher hasher,
        IUnitOfWork unitOfWork)
    {
        _users = users;
        _hasher = hasher;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(
        ChangePasswordCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _users.GetByIdAsync(request.UserId);

        if (user is null)
            return Result.Failure(UserErrors.UserNotFound);

        if (!_hasher.Verify(request.CurrentPassword, user.PasswordHash))
            return Result.Failure(UserErrors.InvalidCurrentPassword);

        user.PasswordHash = _hasher.Hash(request.NewPassword);

        await _users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}

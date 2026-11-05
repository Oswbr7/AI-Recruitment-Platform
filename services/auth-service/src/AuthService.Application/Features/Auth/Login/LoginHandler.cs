using AuthService.Application.Abstractions.Authentication;
using AuthService.Application.Abstractions.Persistence;
using AuthService.Application.Abstractions.Security;
using AuthService.Application.Common.Errors;
using AuthService.Application.Features.Auth.Commands;
using BuildingBlocks.Application.Common.Errors;
using MediatR;

namespace AuthService.Application.Features.Auth.Login;

public class LoginHandler
    : IRequestHandler<LoginCommand, Result<LoginResponse>>
{
    private readonly IUserRepository _users;
    private readonly IPasswordHasher _hasher;
    private readonly IJwtProvider _jwt;

    public LoginHandler(
        IUserRepository users,
        IPasswordHasher hasher,
        IJwtProvider jwt)
    {
        _users = users;
        _hasher = hasher;
        _jwt = jwt;
    }

    public async Task<Result<LoginResponse>> Handle(
        LoginCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _users.GetByEmailAsync(request.Email);

        if (user is null)
            return Result<LoginResponse>.Failure(UserErrors.InvalidCredentials);

        if (!_hasher.Verify(request.Password, user.PasswordHash))
            return Result<LoginResponse>.Failure(UserErrors.InvalidCredentials);

        var token = _jwt.Generate(user);

        var response = new LoginResponse(
            token.AccessToken,
            token.ExpiresAt,
            new UserSummary(
                user.Id,
                $"{user.FirstName} {user.LastName}".Trim(),
                user.Email));

        return Result<LoginResponse>.Success(response);
    }
}

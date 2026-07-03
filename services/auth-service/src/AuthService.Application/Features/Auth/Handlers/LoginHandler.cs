using AuthService.Application.Abstractions.Authentication;
using AuthService.Application.Abstractions.Persistence;
using AuthService.Application.Abstractions.Security;
using AuthService.Application.Common.Results;
using AuthService.Application.Features.Auth.Commands;
using MediatR;

public class LoginHandler
    : IRequestHandler<LoginCommand, Result<string>>
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

    public async Task<Result<string>> Handle(
        LoginCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _users.GetByEmailAsync(request.Email);

        if (user == null)
            return Result<string>.Failure("Invalid credentials");

        if (!_hasher.Verify(request.Password, user.PasswordHash))
            return Result<string>.Failure("Invalid credentials");

        var token = _jwt.Generate(user);

        return Result<string>.Success(token);
    }
}
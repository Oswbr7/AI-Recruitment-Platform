using AuthService.Application.Abstractions.Authentication;
using AuthService.Application.Abstractions.Persistence;
using AuthService.Application.Abstractions.Security;
using AuthService.Application.Common.Errors;
using AuthService.Application.Features.Auth.Commands;
using AuthService.Application.Features.Auth.Login;
using AuthService.Domain.Entities;
using AuthService.Domain.Enums;
using Moq;

namespace AuthService.Tests.Features.Auth.Login;

public class LoginHandlerTests
{
    private readonly Mock<IUserRepository> _users = new();
    private readonly Mock<IPasswordHasher> _hasher = new();
    private readonly Mock<IJwtProvider> _jwt = new();

    private LoginHandler CreateHandler() =>
        new(_users.Object, _hasher.Object, _jwt.Object);

    private static User ExistingUser() =>
        new()
        {
            Id = Guid.NewGuid(),
            Email = "juan@example.com",
            PasswordHash = "hash",
            FirstName = "Juan",
            LastName = "Pérez",
            Role = UserRole.Recruiter,
        };

    [Fact]
    public async Task Handle_UserNotFound_ReturnsInvalidCredentials()
    {
        _users.Setup(x => x.GetByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync((User?)null);

        var result = await CreateHandler().Handle(
            new LoginCommand("noexiste@example.com", "Password123!"),
            CancellationToken.None);

        Assert.True(result.IsFailure);
        Assert.Equal(UserErrors.InvalidCredentials, result.Error);
        _jwt.Verify(x => x.Generate(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_WrongPassword_ReturnsInvalidCredentials()
    {
        var user = ExistingUser();
        _users.Setup(x => x.GetByEmailAsync(user.Email)).ReturnsAsync(user);
        _hasher.Setup(x => x.Verify("mala", user.PasswordHash)).Returns(false);

        var result = await CreateHandler().Handle(
            new LoginCommand(user.Email, "mala"),
            CancellationToken.None);

        Assert.True(result.IsFailure);
        Assert.Equal(UserErrors.InvalidCredentials, result.Error);
        _jwt.Verify(x => x.Generate(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_ValidCredentials_ReturnsLoginResponseWithUserSummary()
    {
        var user = ExistingUser();
        var expiresAt = DateTime.UtcNow.AddHours(8);

        _users.Setup(x => x.GetByEmailAsync(user.Email)).ReturnsAsync(user);
        _hasher.Setup(x => x.Verify("Password123!", user.PasswordHash)).Returns(true);
        _jwt.Setup(x => x.Generate(user))
            .Returns(new GeneratedToken("token-jwt", expiresAt));

        var result = await CreateHandler().Handle(
            new LoginCommand(user.Email, "Password123!"),
            CancellationToken.None);

        Assert.True(result.IsSuccess);

        // Contrato que el frontend consume (LoginResponse.ts):
        // accessToken, expiresAt y user {id, fullName, email, role}.
        Assert.Equal("token-jwt", result.Value.AccessToken);
        Assert.Equal(expiresAt, result.Value.ExpiresAt);
        Assert.Equal(user.Id, result.Value.User.Id);
        Assert.Equal("Juan Pérez", result.Value.User.FullName);
        Assert.Equal(user.Email, result.Value.User.Email);
        Assert.Equal("Recruiter", result.Value.User.Role);

        _jwt.Verify(x => x.Generate(user), Times.Once);
    }
}

using AuthService.Application.Abstractions.Persistence;
using AuthService.Application.Abstractions.Security;
using AuthService.Application.Common.Errors;
using AuthService.Application.Features.Auth.ChangePassword;
using AuthService.Application.Features.Auth.Commands;
using AuthService.Domain.Entities;
using AuthService.Domain.Enums;
using Moq;

namespace AuthService.Tests.Features.Auth.ChangePassword;

public class ChangePasswordHandlerTests
{
    private readonly Mock<IUserRepository> _users = new();
    private readonly Mock<IPasswordHasher> _hasher = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();

    private ChangePasswordHandler CreateHandler() =>
        new(_users.Object, _hasher.Object, _unitOfWork.Object);

    private static User ExistingUser() =>
        new()
        {
            Id = Guid.NewGuid(),
            Email = "juan@example.com",
            PasswordHash = "hash-viejo",
            FirstName = "Juan",
            LastName = "Pérez",
            Role = UserRole.Candidate,
        };

    private static ChangePasswordCommand CommandFor(Guid userId) =>
        new(userId, "PasswordVieja1!", "PasswordNueva1!");

    [Fact]
    public async Task Handle_UserNotFound_ReturnsUserNotFound()
    {
        _users.Setup(x => x.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((User?)null);

        var result = await CreateHandler().Handle(
            CommandFor(Guid.NewGuid()), CancellationToken.None);

        Assert.True(result.IsFailure);
        Assert.Equal(UserErrors.UserNotFound, result.Error);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task Handle_WrongCurrentPassword_ReturnsInvalidCurrentPassword()
    {
        var user = ExistingUser();
        _users.Setup(x => x.GetByIdAsync(user.Id)).ReturnsAsync(user);
        _hasher.Setup(x => x.Verify("PasswordVieja1!", user.PasswordHash)).Returns(false);

        var result = await CreateHandler().Handle(
            CommandFor(user.Id), CancellationToken.None);

        Assert.True(result.IsFailure);
        Assert.Equal(UserErrors.InvalidCurrentPassword, result.Error);

        _users.Verify(x => x.UpdateAsync(It.IsAny<User>()), Times.Never);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task Handle_ValidRequest_RehashesPersistsAndReturnsSuccess()
    {
        var user = ExistingUser();
        _users.Setup(x => x.GetByIdAsync(user.Id)).ReturnsAsync(user);
        _hasher.Setup(x => x.Verify("PasswordVieja1!", user.PasswordHash)).Returns(true);
        _hasher.Setup(x => x.Hash("PasswordNueva1!")).Returns("hash-nuevo");

        var result = await CreateHandler().Handle(
            CommandFor(user.Id), CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.Equal("hash-nuevo", user.PasswordHash);

        _users.Verify(x => x.UpdateAsync(user), Times.Once);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }
}

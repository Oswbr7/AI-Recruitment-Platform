using AuthService.Application.Features.Users.ChangeRole;
using AuthService.Domain.Entities;
using AuthService.Domain.Enums;
using AuthService.Application.Abstractions.Persistence;
using Moq;

namespace AuthService.Tests.Features.Users.ChangeRole;

public class ChangeUserRoleHandlerTests
{
    private readonly Mock<IUserRepository> _users = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();

    private ChangeUserRoleHandler CreateHandler() =>
        new(_users.Object, _unitOfWork.Object);

    [Fact]
    public async Task Handle_UserNotFound_ReturnsNull()
    {
        _users.Setup(x => x.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((User?)null);

        var result = await CreateHandler().Handle(
            new ChangeUserRoleCommand(Guid.NewGuid(), UserRole.Recruiter),
            CancellationToken.None);

        Assert.Null(result);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task Handle_ExistingUser_ChangesRolePersistsAndReturnsResponse()
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "juan@example.com",
            Role = UserRole.Candidate,
        };
        _users.Setup(x => x.GetByIdAsync(user.Id)).ReturnsAsync(user);

        var result = await CreateHandler().Handle(
            new ChangeUserRoleCommand(user.Id, UserRole.Recruiter),
            CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(user.Id, result!.Id);
        Assert.Equal("Recruiter", result.Role);
        Assert.Equal(UserRole.Recruiter, user.Role);

        _users.Verify(x => x.UpdateAsync(user), Times.Once);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }
}

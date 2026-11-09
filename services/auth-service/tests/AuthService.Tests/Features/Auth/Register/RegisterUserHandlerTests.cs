using AuthService.Application.Abstractions.Persistence;
using AuthService.Application.Abstractions.Security;
using AuthService.Application.Common.Errors;
using AuthService.Application.Features.Auth.Commands;
using AuthService.Application.Features.Auth.Register;
using AuthService.Domain.Entities;
using Moq;

namespace AuthService.Tests.Features.Auth.Register;

public class RegisterUserHandlerTests
{
    private readonly Mock<IUserRepository> _users = new();
    private readonly Mock<IPasswordHasher> _hasher = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();

    private RegisterUserHandler CreateHandler() =>
        new(_users.Object, _hasher.Object, _unitOfWork.Object);

    private static RegisterUserCommand Command() =>
        new("nuevo@example.com", "Password123!", "Ana", "García");

    [Fact]
    public async Task Handle_DuplicateEmail_ReturnsEmailAlreadyExists()
    {
        _users.Setup(x => x.GetByEmailAsync("nuevo@example.com"))
            .ReturnsAsync(new User { Email = "nuevo@example.com" });

        var result = await CreateHandler().Handle(Command(), CancellationToken.None);

        Assert.True(result.IsFailure);
        Assert.Equal(UserErrors.EmailAlreadyExists, result.Error);

        // Nada se persiste cuando el registro falla.
        _users.Verify(x => x.AddAsync(It.IsAny<User>()), Times.Never);
        _unitOfWork.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_NewUser_HashesPasswordPersistsAndReturnsId()
    {
        _users.Setup(x => x.GetByEmailAsync("nuevo@example.com"))
            .ReturnsAsync((User?)null);
        _hasher.Setup(x => x.Hash("Password123!")).Returns("hash-generado");

        User? captured = null;
        _users.Setup(x => x.AddAsync(It.IsAny<User>()))
            .Callback<User>(u => captured = u);

        var result = await CreateHandler().Handle(Command(), CancellationToken.None);

        Assert.True(result.IsSuccess);
        Assert.NotNull(captured);
        Assert.Equal(result.Value, captured!.Id);
        Assert.Equal("hash-generado", captured.PasswordHash);
        Assert.Equal("Ana", captured.FirstName);
        Assert.Equal("García", captured.LastName);
        Assert.Equal(UserRoleValue(), captured.Role.ToString());

        // UnitOfWork confirma una sola vez (ver arquitectura §3).
        _unitOfWork.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    // El rol por defecto es Candidate (gap conocido documentado en
    // architecture.md §5: no hay forma de crear Recruiter/Admin via API).
    private static string UserRoleValue() => "Candidate";
}

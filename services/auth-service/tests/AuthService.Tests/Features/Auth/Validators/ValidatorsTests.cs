using FluentValidation.TestHelper;
using AuthService.Application.Features.Auth.Commands;
using AuthService.Application.Features.Auth.Validators;

namespace AuthService.Tests.Features.Auth.Validators;

// Los validators son la frontera donde la API rechaza input inválido ANTES
// del handler: los tests fijan el contrato de validación de cada comando.
public class LoginValidatorTests
{
    private readonly LoginValidator _validator = new();

    private static LoginCommand ValidCommand() =>
        new("juan@example.com", "Password123!");

    [Fact]
    public void ValidCommand_Passes()
    {
        var result = _validator.TestValidate(ValidCommand());
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void EmptyEmail_Fails()
    {
        var result = _validator.TestValidate(ValidCommand() with { Email = "" });
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void InvalidEmailFormat_Fails()
    {
        var result = _validator.TestValidate(ValidCommand() with { Email = "no-es-email" });
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void EmptyPassword_Fails()
    {
        var result = _validator.TestValidate(ValidCommand() with { Password = "" });
        result.ShouldHaveValidationErrorFor(x => x.Password);
    }
}

public class RegisterUserCommandValidatorTests
{
    private readonly RegisterUserCommandValidator _validator = new();

    private static RegisterUserCommand ValidCommand() =>
        new("nuevo@example.com", "Password123!", "Ana", "García");

    [Fact]
    public void ValidCommand_Passes()
    {
        var result = _validator.TestValidate(ValidCommand());
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void PasswordShorterThan8_Fails()
    {
        var result = _validator.TestValidate(ValidCommand() with { Password = "1234567" });
        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void InvalidEmail_Fails()
    {
        var result = _validator.TestValidate(ValidCommand() with { Email = "sin-arroba" });
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void EmptyFirstName_Fails()
    {
        var result = _validator.TestValidate(ValidCommand() with { FirstName = "" });
        result.ShouldHaveValidationErrorFor(x => x.FirstName);
    }
}

public class ChangePasswordValidatorTests
{
    private readonly ChangePasswordValidator _validator = new();

    private static ChangePasswordCommand ValidCommand() =>
        new(Guid.NewGuid(), "PasswordVieja1!", "PasswordNueva1!");

    [Fact]
    public void ValidCommand_Passes()
    {
        var result = _validator.TestValidate(ValidCommand());
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void NewPasswordEqualToCurrent_Fails()
    {
        var result = _validator.TestValidate(
            ValidCommand() with { NewPassword = "PasswordVieja1!" });

        result.ShouldHaveValidationErrorFor(x => x.NewPassword);
    }

    [Fact]
    public void NewPasswordShorterThan8_Fails()
    {
        var result = _validator.TestValidate(ValidCommand() with { NewPassword = "1234567" });
        result.ShouldHaveValidationErrorFor(x => x.NewPassword);
    }
}

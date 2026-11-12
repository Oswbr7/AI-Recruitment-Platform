using AuthService.Application.Features.Auth.Commands;
using FluentValidation;

namespace AuthService.Application.Features.Auth.Validators;

public class RegisterUserCommandValidator
    : AbstractValidator<RegisterUserCommand>
{
    public RegisterUserCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Password)
            .NotEmpty()
            // Paridad con la UI (loginSchema del frontend exige 8).
            .MinimumLength(8);

        RuleFor(x => x.FirstName)
            .NotEmpty();

        RuleFor(x => x.LastName)
            .NotEmpty();
    }
}
using AuthService.Application.Features.Auth.Commands;
using FluentValidation;

namespace AuthService.Application.Features.Auth.Validators;

public sealed class ChangePasswordValidator
    : AbstractValidator<ChangePasswordCommand>
{
    public ChangePasswordValidator()
    {
        RuleFor(x => x.CurrentPassword)
            .NotEmpty();

        RuleFor(x => x.NewPassword)
            .NotEmpty()
            // Paridad con registro/login (min 8).
            .MinimumLength(8)
            .NotEqual(x => x.CurrentPassword)
            .WithMessage("The new password must be different from the current one.");
    }
}

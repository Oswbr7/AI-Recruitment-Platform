using FluentValidation;

namespace CandidateService.Application.Features.Candidates.CreateMyProfile;

public sealed class CreateMyProfileValidator : AbstractValidator<CreateMyProfileCommand>
{
    public CreateMyProfileValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty();

        RuleFor(x => x.FirstName)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.LastName)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(200);

        RuleFor(x => x.Phone)
            .MaximumLength(30);

        RuleFor(x => x.Location)
            .MaximumLength(150);

        RuleFor(x => x.Headline)
            .MaximumLength(200);
    }
}

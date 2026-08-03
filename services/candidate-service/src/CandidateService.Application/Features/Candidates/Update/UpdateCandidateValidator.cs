using FluentValidation;

namespace CandidateService.Application.Features.Candidates.Update;

public class UpdateCandidateValidator : AbstractValidator<UpdateCandidateCommand>
{
    public UpdateCandidateValidator()
    {
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

        RuleFor(x => x.LinkedInUrl)
            .MaximumLength(300);

        RuleFor(x => x.GithubUrl)
            .MaximumLength(300);

        RuleFor(x => x.PortfolioUrl)
            .MaximumLength(300);

        RuleFor(x => x.CurrentCompany)
            .MaximumLength(150);

        RuleFor(x => x.CurrentPosition)
            .MaximumLength(150);

        RuleFor(x => x.YearsOfExperience)
            .GreaterThanOrEqualTo(0)
            .When(x => x.YearsOfExperience.HasValue);

        RuleFor(x => x.ExpectedSalary)
            .GreaterThanOrEqualTo(0)
            .When(x => x.ExpectedSalary.HasValue);

        RuleFor(x => x.Currency)
            .Length(3)
            .When(x => x.Currency != null);
    }
}

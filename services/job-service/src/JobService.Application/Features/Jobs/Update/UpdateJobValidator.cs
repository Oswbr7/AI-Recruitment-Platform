using FluentValidation;

namespace JobService.Application.Features.Jobs.Update;

public class UpdateJobValidator : AbstractValidator<UpdateJobCommand>
{
    public UpdateJobValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(150);

        RuleFor(x => x.Description)
            .NotEmpty();

        RuleFor(x => x.Department)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.Location)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.EmploymentType)
            .IsInEnum();

        RuleFor(x => x.ExperienceLevel)
            .IsInEnum();

        RuleFor(x => x.RemoteType)
            .IsInEnum();

        RuleFor(x => x.Currency)
            .Length(3)
            .When(x => x.Currency != null);

        RuleFor(x => x.SalaryMax)
            .GreaterThanOrEqualTo(x => x.SalaryMin)
            .When(x => x.SalaryMin.HasValue && x.SalaryMax.HasValue);
    }
}

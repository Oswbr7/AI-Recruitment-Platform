using CandidateService.Domain.Enums;
using FluentValidation;

namespace CandidateService.Application.Features.Applications.Submit;

public sealed class SubmitApplicationValidator : AbstractValidator<SubmitApplicationCommand>
{
    public SubmitApplicationValidator()
    {
        RuleFor(x => x.CandidateId)
            .NotEmpty();

        RuleFor(x => x.JobId)
            .NotEmpty();

        RuleFor(x => x.Source)
            .IsInEnum()
            .When(x => x.Source.HasValue);

        RuleFor(x => x.CoverNote)
            .MaximumLength(2000);
    }
}

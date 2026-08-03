using FluentValidation;

namespace CandidateService.Application.Features.Candidates.Notes.UpdateCandidateNote;

public class UpdateCandidateNoteValidator : AbstractValidator<UpdateCandidateNoteCommand>
{
    public UpdateCandidateNoteValidator()
    {
        RuleFor(x => x.Content)
            .NotEmpty()
            .MaximumLength(2000);
    }
}

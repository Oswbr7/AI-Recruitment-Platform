using FluentValidation;

namespace CandidateService.Application.Features.Candidates.Notes.AddCandidateNote;

public class AddCandidateNoteValidator : AbstractValidator<AddCandidateNoteCommand>
{
    public AddCandidateNoteValidator()
    {
        RuleFor(x => x.Content)
            .NotEmpty()
            .MaximumLength(2000);
    }
}

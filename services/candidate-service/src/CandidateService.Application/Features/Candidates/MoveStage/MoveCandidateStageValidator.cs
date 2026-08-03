using FluentValidation;

namespace CandidateService.Application.Features.Candidates.MoveStage;

public class MoveCandidateStageValidator : AbstractValidator<MoveCandidateStageCommand>
{
    public MoveCandidateStageValidator()
    {
        RuleFor(x => x.Stage)
            .IsInEnum();
    }
}

using FluentValidation;

namespace InterviewService.Application.Features.Interviews.Feedback.SubmitFeedback;

public class SubmitInterviewFeedbackValidator : AbstractValidator<SubmitInterviewFeedbackCommand>
{
    public SubmitInterviewFeedbackValidator()
    {
        RuleFor(x => x.ReviewerId)
            .NotEmpty();

        RuleFor(x => x.TechnicalScore)
            .InclusiveBetween(1, 10);

        RuleFor(x => x.CommunicationScore)
            .InclusiveBetween(1, 10);

        RuleFor(x => x.ProblemSolvingScore)
            .InclusiveBetween(1, 10);

        RuleFor(x => x.CultureFitScore)
            .InclusiveBetween(1, 10);

        RuleFor(x => x.Recommendation)
            .IsInEnum();
    }
}

using FluentValidation;

namespace InterviewService.Application.Features.Interviews.Update;

public class UpdateInterviewValidator : AbstractValidator<UpdateInterviewCommand>
{
    public UpdateInterviewValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.InterviewType)
            .IsInEnum();

        RuleFor(x => x.InterviewStage)
            .IsInEnum();

        RuleFor(x => x.DurationMinutes)
            .GreaterThan(0);

        RuleFor(x => x.MeetingUrl)
            .MaximumLength(300);

        RuleFor(x => x.Location)
            .MaximumLength(300);
    }
}

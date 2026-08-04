using FluentValidation;

namespace InterviewService.Application.Features.Interviews.Reschedule;

public class RescheduleInterviewValidator : AbstractValidator<RescheduleInterviewCommand>
{
    public RescheduleInterviewValidator()
    {
        RuleFor(x => x.ScheduledAt)
            .NotEmpty();
    }
}

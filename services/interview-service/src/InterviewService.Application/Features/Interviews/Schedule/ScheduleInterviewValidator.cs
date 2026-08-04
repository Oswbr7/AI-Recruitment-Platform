using FluentValidation;

namespace InterviewService.Application.Features.Interviews.Schedule;

public class ScheduleInterviewValidator : AbstractValidator<ScheduleInterviewCommand>
{
    public ScheduleInterviewValidator()
    {
        RuleFor(x => x.CandidateId)
            .NotEmpty();

        RuleFor(x => x.JobId)
            .NotEmpty();

        RuleFor(x => x.RecruiterId)
            .NotEmpty();

        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.InterviewType)
            .IsInEnum();

        RuleFor(x => x.InterviewStage)
            .IsInEnum();

        RuleFor(x => x.ScheduledAt)
            .NotEmpty();

        RuleFor(x => x.DurationMinutes)
            .GreaterThan(0);

        RuleFor(x => x.MeetingUrl)
            .MaximumLength(300);

        RuleFor(x => x.Location)
            .MaximumLength(300);
    }
}

using FluentValidation.TestHelper;
using InterviewService.Application.Features.Interviews.Reschedule;
using InterviewService.Application.Features.Interviews.Schedule;
using InterviewService.Domain.Enums;

namespace InterviewService.Tests.Features.Interviews.Validators;

public class ScheduleInterviewValidatorTests
{
    private readonly ScheduleInterviewValidator _validator = new();

    private static ScheduleInterviewCommand ValidCommand() =>
        new(
            CandidateId: Guid.NewGuid(),
            JobId: Guid.NewGuid(),
            RecruiterId: Guid.NewGuid(),
            Title: "Entrevista técnica",
            Description: null,
            InterviewType: InterviewType.Video,
            InterviewStage: InterviewStage.Technical,
            ScheduledAt: DateTime.UtcNow.AddDays(1),
            DurationMinutes: 60,
            MeetingUrl: null,
            Location: null);

    [Fact]
    public void ValidCommand_Passes()
    {
        var result = _validator.TestValidate(ValidCommand());
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void EmptyTitle_Fails()
    {
        var result = _validator.TestValidate(ValidCommand() with { Title = "" });
        result.ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Fact]
    public void TitleLongerThan200_Fails()
    {
        var result = _validator.TestValidate(
            ValidCommand() with { Title = new string('a', 201) });

        result.ShouldHaveValidationErrorFor(x => x.Title);
    }

    [Fact]
    public void ZeroDuration_Fails()
    {
        var result = _validator.TestValidate(ValidCommand() with { DurationMinutes = 0 });
        result.ShouldHaveValidationErrorFor(x => x.DurationMinutes);
    }

    [Fact]
    public void EmptyCandidateId_Fails()
    {
        var result = _validator.TestValidate(ValidCommand() with { CandidateId = Guid.Empty });
        result.ShouldHaveValidationErrorFor(x => x.CandidateId);
    }
}

public class RescheduleInterviewValidatorTests
{
    private readonly RescheduleInterviewValidator _validator = new();

    [Fact]
    public void FutureDate_Passes()
    {
        var result = _validator.TestValidate(
            new RescheduleInterviewCommand(Guid.NewGuid(), DateTime.UtcNow.AddDays(2)));

        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void DefaultDateTime_Fails()
    {
        // NotEmpty sobre DateTime rechaza el valor por defecto (MinValue).
        var result = _validator.TestValidate(
            new RescheduleInterviewCommand(Guid.NewGuid(), default));

        result.ShouldHaveValidationErrorFor(x => x.ScheduledAt);
    }
}

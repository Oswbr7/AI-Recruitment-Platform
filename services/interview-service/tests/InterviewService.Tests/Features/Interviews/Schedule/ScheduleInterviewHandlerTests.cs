using InterviewService.Application.Features.Interviews.Schedule;
using InterviewService.Domain.Entities;
using InterviewService.Domain.Enums;
using InterviewService.Domain.Repositories;
using Moq;

namespace InterviewService.Tests.Features.Interviews.Schedule;

public class ScheduleInterviewHandlerTests
{
    private readonly Mock<IInterviewRepository> _interviews = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();

    private ScheduleInterviewHandler CreateHandler() =>
        new(_interviews.Object, _unitOfWork.Object);

    private static ScheduleInterviewCommand Command() =>
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
            MeetingUrl: "https://meet.example/abc",
            Location: null);

    [Fact]
    public async Task Handle_SchedulesInterviewPersistsAndReturnsId()
    {
        Interview? captured = null;
        _interviews.Setup(x => x.AddAsync(It.IsAny<Interview>(), It.IsAny<CancellationToken>()))
            .Callback<Interview, CancellationToken>((interview, _) => captured = interview);

        var response = await CreateHandler().Handle(Command(), CancellationToken.None);

        Assert.NotNull(captured);
        Assert.Equal(response.Id, captured!.Id);
        // Invariantes del factory: toda entrevista nace Scheduled.
        Assert.Equal(InterviewStatus.Scheduled, captured.Status);
        Assert.False(captured.FeedbackSubmitted);

        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }
}

using InterviewService.Application.Features.Interviews.Reschedule;
using InterviewService.Domain.Entities;
using InterviewService.Domain.Enums;
using InterviewService.Domain.Repositories;
using Moq;

namespace InterviewService.Tests.Features.Interviews.Reschedule;

public class RescheduleInterviewHandlerTests
{
    private readonly Mock<IInterviewRepository> _interviews = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();

    private RescheduleInterviewHandler CreateHandler() =>
        new(_interviews.Object, _unitOfWork.Object);

    private static Interview ScheduledInterview() =>
        Interview.Schedule(
            Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(),
            "Entrevista tecnica", null,
            InterviewType.Video, InterviewStage.Technical,
            DateTime.UtcNow.AddDays(1), 60);

    [Fact]
    public async Task Handle_InterviewNotFound_ReturnsNull()
    {
        _interviews.Setup(x => x.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Interview?)null);

        var result = await CreateHandler().Handle(
            new RescheduleInterviewCommand(Guid.NewGuid(), DateTime.UtcNow.AddDays(2)),
            CancellationToken.None);

        Assert.Null(result);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task Handle_NoOverlap_ReschedulesPersistsAndExcludesItself()
    {
        var interview = ScheduledInterview();
        var newTime = DateTime.UtcNow.AddDays(3);

        _interviews.Setup(x => x.GetByIdAsync(interview.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(interview);

        var result = await CreateHandler().Handle(
            new RescheduleInterviewCommand(interview.Id, newTime),
            CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(newTime, interview.ScheduledAt);

        // El chequeo de agenda EXCLUYE a la propia entrevista (sin esto,
        // cualquier entrevista "se chocaria consigo misma").
        _interviews.Verify(x => x.HasOverlapForRecruiterAsync(
            interview.RecruiterId, newTime, interview.DurationMinutes,
            interview.Id, It.IsAny<CancellationToken>()), Times.Once);

        _interviews.Verify(
            x => x.UpdateAsync(interview, It.IsAny<CancellationToken>()),
            Times.Once);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task Handle_OverlapWithAnotherInterview_ThrowsAndDoesNotPersist()
    {
        var interview = ScheduledInterview();
        var newTime = DateTime.UtcNow.AddDays(3);

        _interviews.Setup(x => x.GetByIdAsync(interview.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(interview);

        _interviews.Setup(x => x.HasOverlapForRecruiterAsync(
                interview.RecruiterId, newTime, interview.DurationMinutes,
                interview.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            CreateHandler().Handle(
                new RescheduleInterviewCommand(interview.Id, newTime),
                CancellationToken.None));

        _interviews.Verify(
            x => x.UpdateAsync(It.IsAny<Interview>(), It.IsAny<CancellationToken>()),
            Times.Never);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never);
    }
}

using InterviewService.Application.Features.Interviews.Cancel;
using InterviewService.Domain.Entities;
using InterviewService.Domain.Enums;
using InterviewService.Domain.Repositories;
using Moq;

namespace InterviewService.Tests.Features.Interviews.Cancel;

public class CancelInterviewHandlerTests
{
    private readonly Mock<IInterviewRepository> _interviews = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();

    private CancelInterviewHandler CreateHandler() =>
        new(_interviews.Object, _unitOfWork.Object);

    private static Interview ScheduledInterview() =>
        Interview.Schedule(
            Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(),
            "Entrevista técnica", null,
            InterviewType.Video, InterviewStage.Technical,
            DateTime.UtcNow.AddDays(1), 60);

    [Fact]
    public async Task Handle_InterviewNotFound_ReturnsNull()
    {
        _interviews.Setup(x => x.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Interview?)null);

        var result = await CreateHandler().Handle(
            new CancelInterviewCommand(Guid.NewGuid()), CancellationToken.None);

        Assert.Null(result);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task Handle_ScheduledInterview_CancelsPersistsAndReturnsResponse()
    {
        var interview = ScheduledInterview();
        _interviews.Setup(x => x.GetByIdAsync(interview.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(interview);

        var result = await CreateHandler().Handle(
            new CancelInterviewCommand(interview.Id), CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(interview.Id, result!.Id);
        Assert.Equal("Cancelled", result.Status);

        _interviews.Verify(
            x => x.UpdateAsync(interview, It.IsAny<CancellationToken>()),
            Times.Once);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task Handle_AlreadyCancelledInterview_ThrowsAndDoesNotPersist()
    {
        var interview = ScheduledInterview();
        interview.Cancel(); // la segunda llamada a Cancel() debe fallar

        _interviews.Setup(x => x.GetByIdAsync(interview.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(interview);

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            CreateHandler().Handle(new CancelInterviewCommand(interview.Id), CancellationToken.None));

        _interviews.Verify(
            x => x.UpdateAsync(It.IsAny<Interview>(), It.IsAny<CancellationToken>()),
            Times.Never);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never);
    }
}

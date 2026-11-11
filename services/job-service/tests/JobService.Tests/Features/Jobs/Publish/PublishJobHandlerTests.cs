using JobService.Application.Features.Jobs.Publish;
using JobService.Domain.Entities;
using JobService.Domain.Enums;
using JobService.Domain.Repositories;
using Moq;

namespace JobService.Tests.Features.Jobs.Publish;

public class PublishJobHandlerTests
{
    private readonly Mock<IJobRepository> _jobs = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();

    private PublishJobHandler CreateHandler() =>
        new(_jobs.Object, _unitOfWork.Object);

    private static Job DraftJob() =>
        Job.Create(
            "Backend Developer", "Desc", "Engineering", "Remoto",
            EmploymentType.FullTime, ExperienceLevel.MidLevel, RemoteType.Remote);

    [Fact]
    public async Task Handle_JobNotFound_ReturnsNull()
    {
        _jobs.Setup(x => x.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Job?)null);

        var result = await CreateHandler().Handle(
            new PublishJobCommand(Guid.NewGuid()), CancellationToken.None);

        Assert.Null(result);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task Handle_DraftJob_PublishesPersistsAndReturnsResponse()
    {
        var job = DraftJob();
        _jobs.Setup(x => x.GetByIdAsync(job.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(job);

        var result = await CreateHandler().Handle(
            new PublishJobCommand(job.Id), CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(job.Id, result!.Id);
        Assert.Equal("Published", result.Status);
        Assert.NotNull(result.PublishedAt);

        _jobs.Verify(x => x.UpdateAsync(job, It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task Handle_AlreadyPublishedJob_ThrowsAndDoesNotPersist()
    {
        var job = DraftJob();
        job.Publish(); // primera publición válida; la segunda debe fallar

        _jobs.Setup(x => x.GetByIdAsync(job.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(job);

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            CreateHandler().Handle(new PublishJobCommand(job.Id), CancellationToken.None));

        _jobs.Verify(
            x => x.UpdateAsync(It.IsAny<Job>(), It.IsAny<CancellationToken>()),
            Times.Never);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never);
    }
}

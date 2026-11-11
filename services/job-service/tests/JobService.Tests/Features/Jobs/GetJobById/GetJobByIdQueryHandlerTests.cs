using JobService.Application.Features.Jobs.GetJobById;
using JobService.Domain.Entities;
using JobService.Domain.Enums;
using JobService.Domain.Repositories;
using Moq;

namespace JobService.Tests.Features.Jobs.GetJobById;

public class GetJobByIdQueryHandlerTests
{
    private readonly Mock<IJobRepository> _jobs = new();

    private GetJobByIdQueryHandler CreateHandler() =>
        new(_jobs.Object);

    [Fact]
    public async Task Handle_JobNotFound_ReturnsNull()
    {
        _jobs.Setup(x => x.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Job?)null);

        var result = await CreateHandler().Handle(
            new GetJobByIdQuery(Guid.NewGuid()), CancellationToken.None);

        Assert.Null(result);
    }

    [Fact]
    public async Task Handle_ExistingJob_ReturnsMappedResponse()
    {
        var job = Job.Create(
            "Backend Developer", "Desc", "Engineering", "Remoto",
            EmploymentType.FullTime, ExperienceLevel.MidLevel, RemoteType.Remote);

        _jobs.Setup(x => x.GetByIdAsync(job.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(job);

        var result = await CreateHandler().Handle(
            new GetJobByIdQuery(job.Id), CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(job.Id, result!.Id);
        Assert.Equal("Backend Developer", result.Title);
        Assert.Equal("Draft", result.Status);
    }
}

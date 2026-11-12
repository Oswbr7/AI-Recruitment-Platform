using JobService.Application.Features.Jobs.GetJobs;
using JobService.Domain.Entities;
using JobService.Domain.Enums;
using JobService.Domain.Repositories;
using Moq;

namespace JobService.Tests.Features.Jobs.GetJobs;

public class GetJobsQueryHandlerTests
{
    private readonly Mock<IJobRepository> _jobs = new();

    private GetJobsQueryHandler CreateHandler() =>
        new(_jobs.Object);

    private static Job JobWithTitle(string title) =>
        Job.Create(
            title, "Desc", "Engineering", "Guadalajara",
            EmploymentType.FullTime, ExperienceLevel.MidLevel, RemoteType.Remote);

    [Fact]
    public async Task Handle_ReturnsPagedResponseWithItemsAndTotalCount()
    {
        var items = new List<Job> { JobWithTitle("Backend Developer"), JobWithTitle("Frontend Developer") };

        _jobs.Setup(x => x.GetPagedAsync(
                2, 10, "developer", null, null, null, null, It.IsAny<CancellationToken>()))
            .ReturnsAsync((items, 25));

        var result = await CreateHandler().Handle(
            new GetJobsQuery(Page: 2, PageSize: 10, Search: "developer"),
            CancellationToken.None);

        Assert.Equal(2, result.Items.Count);
        Assert.Equal(25, result.TotalCount);
        Assert.Equal(2, result.Page);
        Assert.Equal(10, result.PageSize);
        Assert.Equal(3, result.TotalPages); // ceil(25/10)

        // Los filtros llegan tal cual al repositorio.
        _jobs.Verify(x => x.GetPagedAsync(
            2, 10, "developer", null, null, null, null,
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_MapsJobsToResponses()
    {
        var job = JobWithTitle("Backend Developer");

        _jobs.Setup(x => x.GetPagedAsync(
                It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string?>(),
                It.IsAny<JobStatus?>(), It.IsAny<Guid?>(),
                It.IsAny<string?>(), It.IsAny<string?>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(([job], 1));

        var result = await CreateHandler().Handle(
            new GetJobsQuery(), CancellationToken.None);

        Assert.Single(result.Items);
        Assert.Equal("Backend Developer", result.Items[0].Title);
        Assert.Equal("Draft", result.Items[0].Status);
    }
}

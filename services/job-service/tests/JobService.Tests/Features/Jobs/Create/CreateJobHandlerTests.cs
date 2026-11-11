using JobService.Application.Features.Jobs.Create;
using JobService.Domain.Entities;
using JobService.Domain.Enums;
using JobService.Domain.Repositories;
using Moq;

namespace JobService.Tests.Features.Jobs.Create;

public class CreateJobHandlerTests
{
    private readonly Mock<IJobRepository> _jobs = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();

    private CreateJobHandler CreateHandler() =>
        new(_jobs.Object, _unitOfWork.Object);

    private static CreateJobCommand Command() =>
        new(
            Title: "Backend Developer",
            Description: "Descripción",
            Department: "Engineering",
            Location: "Remoto",
            EmploymentType: EmploymentType.FullTime,
            ExperienceLevel: ExperienceLevel.MidLevel,
            RemoteType: RemoteType.Remote,
            SalaryMin: 3000,
            SalaryMax: 5000,
            Currency: "USD",
            CompanyId: null);

    [Fact]
    public async Task Handle_CreatesDraftJobPersistsAndReturnsId()
    {
        Job? captured = null;
        _jobs.Setup(x => x.AddAsync(It.IsAny<Job>(), It.IsAny<CancellationToken>()))
            .Callback<Job, CancellationToken>((job, _) => captured = job);

        var response = await CreateHandler().Handle(Command(), CancellationToken.None);

        Assert.NotNull(captured);
        Assert.Equal(response.Id, captured!.Id);
        // Estado inicial de dominio: toda vacante nace Draft (regla del factory).
        Assert.Equal(JobStatus.Draft, captured.Status);
        Assert.Equal("Backend Developer", captured.Title);

        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }
}

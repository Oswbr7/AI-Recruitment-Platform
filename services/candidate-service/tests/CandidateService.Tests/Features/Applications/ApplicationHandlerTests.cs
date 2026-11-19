using CandidateService.Application.Features.Applications.Offer;
using CandidateService.Application.Features.Applications.Submit;
using CandidateService.Domain.Entities;
using CandidateService.Domain.Enums;
using CandidateService.Domain.Repositories;
using Moq;

namespace CandidateService.Tests.Features.Applications;

public class SubmitApplicationHandlerTests
{
    private readonly Mock<ICandidateRepository> _candidates = new();
    private readonly Mock<IJobApplicationRepository> _applications = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();

    private SubmitApplicationHandler CreateHandler() =>
        new(_candidates.Object, _applications.Object, _unitOfWork.Object);

    private static SubmitApplicationCommand Command() =>
        new(Guid.NewGuid(), Guid.NewGuid(), ApplicationSource.Manual, null);

    [Fact]
    public async Task Handle_CandidateNotFound_ReturnsNull()
    {
        _candidates.Setup(x => x.ExistsAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        var result = await CreateHandler().Handle(Command(), CancellationToken.None);

        Assert.Null(result);
        _applications.Verify(
            x => x.AddAsync(It.IsAny<JobApplication>(), It.IsAny<CancellationToken>()),
            Times.Never);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task Handle_ActiveApplicationAlreadyExists_ThrowsAndDoesNotPersist()
    {
        var command = Command();
        _candidates.Setup(x => x.ExistsAsync(command.CandidateId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);
        _applications.Setup(x => x.ExistsActiveForCandidateAndJobAsync(
                command.CandidateId, command.JobId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            CreateHandler().Handle(command, CancellationToken.None));

        _applications.Verify(
            x => x.AddAsync(It.IsAny<JobApplication>(), It.IsAny<CancellationToken>()),
            Times.Never);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task Handle_ValidCommand_PersistsAndReturnsResponse()
    {
        var command = Command();
        _candidates.Setup(x => x.ExistsAsync(command.CandidateId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        JobApplication? captured = null;
        _applications.Setup(x => x.AddAsync(It.IsAny<JobApplication>(), It.IsAny<CancellationToken>()))
            .Callback<JobApplication, CancellationToken>((app, _) => captured = app);

        var result = await CreateHandler().Handle(command, CancellationToken.None);

        Assert.NotNull(result);
        Assert.NotNull(captured);
        Assert.Equal(result!.Id, captured!.Id);
        Assert.Equal("Applied", result.Status);
        Assert.Equal(command.CandidateId, captured.CandidateId);

        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }
}

public class OfferApplicationHandlerTests
{
    private readonly Mock<IJobApplicationRepository> _applications = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();

    private OfferApplicationHandler CreateHandler() =>
        new(_applications.Object, _unitOfWork.Object);

    private static JobApplication InterviewingApplication()
    {
        var app = JobApplication.Submit(Guid.NewGuid(), Guid.NewGuid());
        app.StartReview();
        app.MoveToInterviewing();
        return app;
    }

    [Fact]
    public async Task Handle_NotFound_ReturnsNull()
    {
        _applications.Setup(x => x.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((JobApplication?)null);

        var result = await CreateHandler().Handle(
            new OfferApplicationCommand(Guid.NewGuid()), CancellationToken.None);

        Assert.Null(result);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task Handle_InterviewingApplication_OffersPersistsAndReturnsResponse()
    {
        var application = InterviewingApplication();
        _applications.Setup(x => x.GetByIdAsync(application.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(application);

        var result = await CreateHandler().Handle(
            new OfferApplicationCommand(application.Id), CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal("Offered", result!.Status);

        _applications.Verify(
            x => x.UpdateAsync(application, It.IsAny<CancellationToken>()),
            Times.Once);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }
}

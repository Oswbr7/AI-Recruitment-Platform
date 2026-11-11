using CandidateService.Application.Features.Candidates.MoveStage;
using CandidateService.Domain.Entities;
using CandidateService.Domain.Enums;
using CandidateService.Domain.Repositories;
using Moq;

namespace CandidateService.Tests.Features.Candidates.MoveStage;

public class MoveCandidateStageHandlerTests
{
    private readonly Mock<ICandidateRepository> _candidates = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();

    private MoveCandidateStageHandler CreateHandler() =>
        new(_candidates.Object, _unitOfWork.Object);

    private static Candidate ActiveCandidate() =>
        Candidate.Create("María", "López", "maria@example.com");

    [Fact]
    public async Task Handle_CandidateNotFound_ReturnsNull()
    {
        _candidates.Setup(x => x.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Candidate?)null);

        var result = await CreateHandler().Handle(
            new MoveCandidateStageCommand(Guid.NewGuid(), CandidateStage.Screening),
            CancellationToken.None);

        Assert.Null(result);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task Handle_ActiveCandidate_MovesStagePersistsAndReturnsResponse()
    {
        var candidate = ActiveCandidate();
        _candidates.Setup(x => x.GetByIdAsync(candidate.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(candidate);

        var result = await CreateHandler().Handle(
            new MoveCandidateStageCommand(candidate.Id, CandidateStage.Screening),
            CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(candidate.Id, result!.Id);
        Assert.Equal("Screening", result.Stage);

        _candidates.Verify(
            x => x.UpdateAsync(candidate, It.IsAny<CancellationToken>()),
            Times.Once);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task Handle_ArchivedCandidate_ThrowsAndDoesNotPersist()
    {
        var candidate = ActiveCandidate();
        candidate.Archive(); // un candidato archivado no puede moverse de stage

        _candidates.Setup(x => x.GetByIdAsync(candidate.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(candidate);

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            CreateHandler().Handle(
                new MoveCandidateStageCommand(candidate.Id, CandidateStage.Offer),
                CancellationToken.None));

        _candidates.Verify(
            x => x.UpdateAsync(It.IsAny<Candidate>(), It.IsAny<CancellationToken>()),
            Times.Never);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never);
    }
}

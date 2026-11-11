using CandidateService.Application.Features.Candidates.GetCandidateById;
using CandidateService.Domain.Entities;
using CandidateService.Domain.Repositories;
using Moq;

namespace CandidateService.Tests.Features.Candidates.GetCandidateById;

public class GetCandidateByIdQueryHandlerTests
{
    private readonly Mock<ICandidateRepository> _candidates = new();

    private GetCandidateByIdQueryHandler CreateHandler() =>
        new(_candidates.Object);

    [Fact]
    public async Task Handle_CandidateNotFound_ReturnsNull()
    {
        _candidates.Setup(x => x.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Candidate?)null);

        var result = await CreateHandler().Handle(
            new GetCandidateByIdQuery(Guid.NewGuid()), CancellationToken.None);

        Assert.Null(result);
    }

    [Fact]
    public async Task Handle_ExistingCandidate_ReturnsMappedResponse()
    {
        var candidate = Candidate.Create("María", "López", "maria@example.com");

        _candidates.Setup(x => x.GetByIdAsync(candidate.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(candidate);

        var result = await CreateHandler().Handle(
            new GetCandidateByIdQuery(candidate.Id), CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(candidate.Id, result!.Id);
        Assert.Equal("María", result.FirstName);
        Assert.Equal("Applied", result.Stage);
        Assert.Equal("Active", result.Status);
    }
}

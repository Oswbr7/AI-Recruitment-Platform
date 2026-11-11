using CandidateService.Application.Features.Candidates.Create;
using CandidateService.Domain.Entities;
using CandidateService.Domain.Enums;
using CandidateService.Domain.Repositories;
using Moq;

namespace CandidateService.Tests.Features.Candidates.Create;

public class CreateCandidateHandlerTests
{
    private readonly Mock<ICandidateRepository> _candidates = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();

    private CreateCandidateHandler CreateHandler() =>
        new(_candidates.Object, _unitOfWork.Object);

    private static CreateCandidateCommand Command() =>
        new(
            FirstName: "María",
            LastName: "López",
            Email: "maria@example.com",
            Phone: null,
            Location: "Guadalajara",
            Headline: null,
            Summary: null,
            LinkedInUrl: null,
            GithubUrl: null,
            PortfolioUrl: null,
            CurrentCompany: null,
            CurrentPosition: null,
            YearsOfExperience: 5,
            ExpectedSalary: 45000,
            Currency: "MXN");

    [Fact]
    public async Task Handle_CreatesAppliedCandidatePersistsAndReturnsId()
    {
        Candidate? captured = null;
        _candidates.Setup(x => x.AddAsync(It.IsAny<Candidate>(), It.IsAny<CancellationToken>()))
            .Callback<Candidate, CancellationToken>((candidate, _) => captured = candidate);

        var response = await CreateHandler().Handle(Command(), CancellationToken.None);

        Assert.NotNull(captured);
        Assert.Equal(response.Id, captured!.Id);
        // Invariantes del factory: todo candidato nace en stage Applied y activo.
        Assert.Equal(CandidateStage.Applied, captured.Stage);
        Assert.Equal(CandidateStatus.Active, captured.Status);

        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }
}

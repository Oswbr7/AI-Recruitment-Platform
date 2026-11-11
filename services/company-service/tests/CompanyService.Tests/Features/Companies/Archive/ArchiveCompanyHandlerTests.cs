using CompanyService.Application.Features.Companies.Archive;
using CompanyService.Domain.Entities;
using CompanyService.Domain.Enums;
using CompanyService.Domain.Repositories;
using Moq;

namespace CompanyService.Tests.Features.Companies.Archive;

public class ArchiveCompanyHandlerTests
{
    private readonly Mock<ICompanyRepository> _companies = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();

    private ArchiveCompanyHandler CreateHandler() =>
        new(_companies.Object, _unitOfWork.Object);

    private static Company ActiveCompany() =>
        Company.Create("Acme Corp", Industry.Technology);

    [Fact]
    public async Task Handle_CompanyNotFound_ReturnsNull()
    {
        _companies.Setup(x => x.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Company?)null);

        var result = await CreateHandler().Handle(
            new ArchiveCompanyCommand(Guid.NewGuid()), CancellationToken.None);

        Assert.Null(result);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task Handle_ActiveCompany_ArchivesPersistsAndReturnsResponse()
    {
        var company = ActiveCompany();
        _companies.Setup(x => x.GetByIdAsync(company.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(company);

        var result = await CreateHandler().Handle(
            new ArchiveCompanyCommand(company.Id), CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(company.Id, result!.Id);
        Assert.Equal("Archived", result.Status);

        _companies.Verify(x => x.UpdateAsync(company, It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task Handle_AlreadyArchivedCompany_ThrowsAndDoesNotPersist()
    {
        var company = ActiveCompany();
        company.Archive(); // la segunda llamada a Archive() debe fallar

        _companies.Setup(x => x.GetByIdAsync(company.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(company);

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            CreateHandler().Handle(new ArchiveCompanyCommand(company.Id), CancellationToken.None));

        _companies.Verify(
            x => x.UpdateAsync(It.IsAny<Company>(), It.IsAny<CancellationToken>()),
            Times.Never);
        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Never);
    }
}

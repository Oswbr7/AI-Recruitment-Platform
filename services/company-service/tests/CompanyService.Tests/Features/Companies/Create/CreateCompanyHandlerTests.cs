using CompanyService.Application.Features.Companies.Create;
using CompanyService.Domain.Entities;
using CompanyService.Domain.Enums;
using CompanyService.Domain.Repositories;
using Moq;

namespace CompanyService.Tests.Features.Companies.Create;

public class CreateCompanyHandlerTests
{
    private readonly Mock<ICompanyRepository> _companies = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();

    private CreateCompanyHandler CreateHandler() =>
        new(_companies.Object, _unitOfWork.Object);

    private static CreateCompanyCommand Command() =>
        new(
            Name: "Acme Corp",
            Industry: Industry.Technology,
            LegalName: "Acme Corporation",
            TaxId: "TAX-123",
            Website: "https://acme.example",
            Email: "hola@acme.example",
            Phone: null,
            Description: null,
            CompanySize: CompanySize.Medium,
            FoundedYear: 2015,
            Country: "México",
            State: null,
            City: "CDMX",
            Address: null,
            PostalCode: null);

    [Fact]
    public async Task Handle_CreatesActiveCompanyPersistsAndReturnsId()
    {
        Company? captured = null;
        _companies.Setup(x => x.AddAsync(It.IsAny<Company>(), It.IsAny<CancellationToken>()))
            .Callback<Company, CancellationToken>((company, _) => captured = company);

        var response = await CreateHandler().Handle(Command(), CancellationToken.None);

        Assert.NotNull(captured);
        Assert.Equal(response.Id, captured!.Id);
        Assert.Equal(CompanyStatus.Active, captured.Status);
        Assert.Equal("Acme Corp", captured.Name);

        _unitOfWork.Verify(
            x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }
}

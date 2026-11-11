using CompanyService.Application.Features.Companies.GetCompanyById;
using CompanyService.Domain.Entities;
using CompanyService.Domain.Enums;
using CompanyService.Domain.Repositories;
using Moq;

namespace CompanyService.Tests.Features.Companies.GetCompanyById;

public class GetCompanyByIdQueryHandlerTests
{
    private readonly Mock<ICompanyRepository> _companies = new();

    private GetCompanyByIdQueryHandler CreateHandler() =>
        new(_companies.Object);

    [Fact]
    public async Task Handle_CompanyNotFound_ReturnsNull()
    {
        _companies.Setup(x => x.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Company?)null);

        var result = await CreateHandler().Handle(
            new GetCompanyByIdQuery(Guid.NewGuid()), CancellationToken.None);

        Assert.Null(result);
    }

    [Fact]
    public async Task Handle_ExistingCompany_ReturnsMappedResponse()
    {
        var company = Company.Create("Acme Corp", Industry.Technology);

        _companies.Setup(x => x.GetByIdAsync(company.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(company);

        var result = await CreateHandler().Handle(
            new GetCompanyByIdQuery(company.Id), CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(company.Id, result!.Id);
        Assert.Equal("Acme Corp", result.Name);
        Assert.Equal("Technology", result.Industry);
        Assert.Equal("Active", result.Status);
    }
}

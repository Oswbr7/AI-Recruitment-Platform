using CompanyService.Application.Features.Companies.Common;
using CompanyService.Application.Features.Companies.GetCompanies;
using CompanyService.Domain.Repositories;
using MediatR;

namespace CompanyService.Application.Features.Companies.GetCompanyById;

public sealed class GetCompanyByIdQueryHandler
    : IRequestHandler<GetCompanyByIdQuery, CompanyResponse?>
{
    private readonly ICompanyRepository _companies;

    public GetCompanyByIdQueryHandler(ICompanyRepository companies)
    {
        _companies = companies;
    }

    public async Task<CompanyResponse?> Handle(
        GetCompanyByIdQuery request,
        CancellationToken cancellationToken)
    {
        var company = await _companies.GetByIdAsync(request.Id, cancellationToken);

        return company?.ToResponse();
    }
}

using CompanyService.Application.Features.Companies.Common;
using CompanyService.Domain.Repositories;
using CompanyService.Shared.Common;
using MediatR;

namespace CompanyService.Application.Features.Companies.GetCompanies;

public sealed class GetCompaniesQueryHandler
    : IRequestHandler<GetCompaniesQuery, PagedResponse<CompanyResponse>>
{
    private readonly ICompanyRepository _companies;

    public GetCompaniesQueryHandler(ICompanyRepository companies)
    {
        _companies = companies;
    }

    public async Task<PagedResponse<CompanyResponse>> Handle(
        GetCompaniesQuery request,
        CancellationToken cancellationToken)
    {
        var (items, totalCount) = await _companies.GetPagedAsync(
            request.Page,
            request.PageSize,
            request.Search,
            request.Industry,
            request.Status,
            request.Country,
            request.SortBy,
            request.SortDirection,
            cancellationToken);

        return new PagedResponse<CompanyResponse>
        {
            Items = items.Select(x => x.ToResponse()).ToList(),
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = totalCount
        };
    }
}

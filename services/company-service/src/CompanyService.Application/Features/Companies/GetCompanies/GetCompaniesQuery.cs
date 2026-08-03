using CompanyService.Domain.Enums;
using CompanyService.Shared.Common;
using MediatR;

namespace CompanyService.Application.Features.Companies.GetCompanies;

public sealed record GetCompaniesQuery(
    int Page,
    int PageSize,
    string? Search,
    Industry? Industry,
    CompanyStatus? Status,
    string? Country,
    string? SortBy,
    string? SortDirection) : IRequest<PagedResponse<CompanyResponse>>;

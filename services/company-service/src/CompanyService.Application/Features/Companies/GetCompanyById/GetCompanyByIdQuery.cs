using CompanyService.Application.Features.Companies.GetCompanies;
using MediatR;

namespace CompanyService.Application.Features.Companies.GetCompanyById;

public sealed record GetCompanyByIdQuery(Guid Id) : IRequest<CompanyResponse?>;

using CompanyService.Application.Features.Companies.GetCompanies;
using MediatR;

namespace CompanyService.Application.Features.Companies.UpdateLogo;

public sealed record UpdateCompanyLogoCommand(Guid Id, string? LogoUrl) : IRequest<CompanyResponse?>;

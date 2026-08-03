using CompanyService.Application.Features.Companies.GetCompanies;
using MediatR;

namespace CompanyService.Application.Features.Companies.Restore;

public sealed record RestoreCompanyCommand(Guid Id) : IRequest<CompanyResponse?>;

using CompanyService.Application.Features.Companies.GetCompanies;
using MediatR;

namespace CompanyService.Application.Features.Companies.Archive;

public sealed record ArchiveCompanyCommand(Guid Id) : IRequest<CompanyResponse?>;

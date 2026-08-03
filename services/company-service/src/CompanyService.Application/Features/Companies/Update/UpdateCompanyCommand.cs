using CompanyService.Application.Features.Companies.GetCompanies;
using CompanyService.Domain.Enums;
using MediatR;

namespace CompanyService.Application.Features.Companies.Update;

public record UpdateCompanyCommand(
    Guid Id,
    string Name,
    Industry Industry,
    string? LegalName,
    string? TaxId,
    string? Website,
    string? Email,
    string? Phone,
    string? Description,
    CompanySize? CompanySize,
    int? FoundedYear,
    string? Country,
    string? State,
    string? City,
    string? Address,
    string? PostalCode) : IRequest<CompanyResponse?>;

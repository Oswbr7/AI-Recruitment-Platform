using CompanyService.Domain.Enums;
using MediatR;

namespace CompanyService.Application.Features.Companies.Create;

public record CreateCompanyCommand(
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
    string? PostalCode) : IRequest<CreateCompanyResponse>;

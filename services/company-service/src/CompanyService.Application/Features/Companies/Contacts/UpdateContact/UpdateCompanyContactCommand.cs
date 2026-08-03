using CompanyService.Application.Features.Companies.Contacts.Common;
using MediatR;

namespace CompanyService.Application.Features.Companies.Contacts.UpdateContact;

public sealed record UpdateCompanyContactCommand(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string? Position,
    bool IsPrimaryContact) : IRequest<CompanyContactResponse?>;

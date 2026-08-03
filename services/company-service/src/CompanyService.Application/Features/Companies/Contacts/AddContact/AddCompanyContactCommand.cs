using CompanyService.Application.Features.Companies.Contacts.Common;
using MediatR;

namespace CompanyService.Application.Features.Companies.Contacts.AddContact;

public sealed record AddCompanyContactCommand(
    Guid CompanyId,
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string? Position,
    bool IsPrimaryContact) : IRequest<CompanyContactResponse?>;

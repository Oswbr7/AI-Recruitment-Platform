using MediatR;

namespace CompanyService.Application.Features.Companies.Contacts.DeleteContact;

public sealed record DeleteCompanyContactCommand(Guid Id) : IRequest<bool>;

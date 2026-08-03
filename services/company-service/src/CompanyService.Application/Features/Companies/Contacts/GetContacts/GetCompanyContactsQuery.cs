using CompanyService.Application.Features.Companies.Contacts.Common;
using MediatR;

namespace CompanyService.Application.Features.Companies.Contacts.GetContacts;

public sealed record GetCompanyContactsQuery(Guid CompanyId) : IRequest<List<CompanyContactResponse>?>;

using CompanyService.Application.Features.Companies.Contacts.Common;
using CompanyService.Domain.Repositories;
using MediatR;

namespace CompanyService.Application.Features.Companies.Contacts.GetContacts;

public sealed class GetCompanyContactsQueryHandler
    : IRequestHandler<GetCompanyContactsQuery, List<CompanyContactResponse>?>
{
    private readonly ICompanyRepository _companies;
    private readonly ICompanyContactRepository _contacts;

    public GetCompanyContactsQueryHandler(
        ICompanyRepository companies,
        ICompanyContactRepository contacts)
    {
        _companies = companies;
        _contacts = contacts;
    }

    public async Task<List<CompanyContactResponse>?> Handle(
        GetCompanyContactsQuery request,
        CancellationToken cancellationToken)
    {
        var companyExists = await _companies.ExistsAsync(request.CompanyId, cancellationToken);

        if (!companyExists)
            return null;

        var contacts = await _contacts.GetByCompanyIdAsync(request.CompanyId, cancellationToken);

        return contacts.Select(x => x.ToResponse()).ToList();
    }
}

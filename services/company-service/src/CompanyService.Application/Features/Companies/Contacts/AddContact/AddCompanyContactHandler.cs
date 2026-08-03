using CompanyService.Application.Features.Companies.Contacts.Common;
using CompanyService.Domain.Entities;
using CompanyService.Domain.Repositories;
using MediatR;

namespace CompanyService.Application.Features.Companies.Contacts.AddContact;

public sealed class AddCompanyContactHandler
    : IRequestHandler<AddCompanyContactCommand, CompanyContactResponse?>
{
    private readonly ICompanyRepository _companies;
    private readonly ICompanyContactRepository _contacts;
    private readonly IUnitOfWork _unitOfWork;

    public AddCompanyContactHandler(
        ICompanyRepository companies,
        ICompanyContactRepository contacts,
        IUnitOfWork unitOfWork)
    {
        _companies = companies;
        _contacts = contacts;
        _unitOfWork = unitOfWork;
    }

    public async Task<CompanyContactResponse?> Handle(
        AddCompanyContactCommand request,
        CancellationToken cancellationToken)
    {
        var companyExists = await _companies.ExistsAsync(request.CompanyId, cancellationToken);

        if (!companyExists)
            return null;

        var contact = CompanyContact.Create(
            request.CompanyId,
            request.FirstName,
            request.LastName,
            request.Email,
            request.Phone,
            request.Position,
            request.IsPrimaryContact);

        await _contacts.AddAsync(contact, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return contact.ToResponse();
    }
}

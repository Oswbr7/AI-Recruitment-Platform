using CompanyService.Application.Features.Companies.Contacts.Common;
using CompanyService.Domain.Repositories;
using MediatR;

namespace CompanyService.Application.Features.Companies.Contacts.UpdateContact;

public sealed class UpdateCompanyContactHandler
    : IRequestHandler<UpdateCompanyContactCommand, CompanyContactResponse?>
{
    private readonly ICompanyContactRepository _contacts;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCompanyContactHandler(
        ICompanyContactRepository contacts,
        IUnitOfWork unitOfWork)
    {
        _contacts = contacts;
        _unitOfWork = unitOfWork;
    }

    public async Task<CompanyContactResponse?> Handle(
        UpdateCompanyContactCommand request,
        CancellationToken cancellationToken)
    {
        var contact = await _contacts.GetByIdAsync(request.Id, cancellationToken);

        if (contact is null)
            return null;

        contact.UpdateProfile(
            request.FirstName,
            request.LastName,
            request.Email,
            request.Phone,
            request.Position,
            request.IsPrimaryContact);

        await _contacts.UpdateAsync(contact, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return contact.ToResponse();
    }
}

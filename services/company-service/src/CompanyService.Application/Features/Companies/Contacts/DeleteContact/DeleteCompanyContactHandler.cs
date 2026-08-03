using CompanyService.Domain.Repositories;
using MediatR;

namespace CompanyService.Application.Features.Companies.Contacts.DeleteContact;

public sealed class DeleteCompanyContactHandler
    : IRequestHandler<DeleteCompanyContactCommand, bool>
{
    private readonly ICompanyContactRepository _contacts;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteCompanyContactHandler(
        ICompanyContactRepository contacts,
        IUnitOfWork unitOfWork)
    {
        _contacts = contacts;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(
        DeleteCompanyContactCommand request,
        CancellationToken cancellationToken)
    {
        var contact = await _contacts.GetByIdAsync(request.Id, cancellationToken);

        if (contact is null)
            return false;

        await _contacts.DeleteAsync(contact, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}

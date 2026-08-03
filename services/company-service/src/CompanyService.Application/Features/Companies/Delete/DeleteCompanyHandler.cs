using CompanyService.Domain.Repositories;
using MediatR;

namespace CompanyService.Application.Features.Companies.Delete;

public sealed class DeleteCompanyHandler
    : IRequestHandler<DeleteCompanyCommand, bool>
{
    private readonly ICompanyRepository _companies;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteCompanyHandler(
        ICompanyRepository companies,
        IUnitOfWork unitOfWork)
    {
        _companies = companies;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(
        DeleteCompanyCommand request,
        CancellationToken cancellationToken)
    {
        var company = await _companies.GetByIdAsync(request.Id, cancellationToken);

        if (company is null)
            return false;

        await _companies.DeleteAsync(company, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}

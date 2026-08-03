using CompanyService.Application.Features.Companies.Common;
using CompanyService.Application.Features.Companies.GetCompanies;
using CompanyService.Domain.Repositories;
using MediatR;

namespace CompanyService.Application.Features.Companies.Restore;

public sealed class RestoreCompanyHandler
    : IRequestHandler<RestoreCompanyCommand, CompanyResponse?>
{
    private readonly ICompanyRepository _companies;
    private readonly IUnitOfWork _unitOfWork;

    public RestoreCompanyHandler(
        ICompanyRepository companies,
        IUnitOfWork unitOfWork)
    {
        _companies = companies;
        _unitOfWork = unitOfWork;
    }

    public async Task<CompanyResponse?> Handle(
        RestoreCompanyCommand request,
        CancellationToken cancellationToken)
    {
        var company = await _companies.GetByIdAsync(request.Id, cancellationToken);

        if (company is null)
            return null;

        company.Restore();

        await _companies.UpdateAsync(company, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return company.ToResponse();
    }
}

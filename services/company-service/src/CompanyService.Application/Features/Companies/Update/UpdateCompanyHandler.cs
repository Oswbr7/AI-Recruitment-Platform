using CompanyService.Application.Features.Companies.Common;
using CompanyService.Application.Features.Companies.GetCompanies;
using CompanyService.Domain.Repositories;
using MediatR;

namespace CompanyService.Application.Features.Companies.Update;

public sealed class UpdateCompanyHandler
    : IRequestHandler<UpdateCompanyCommand, CompanyResponse?>
{
    private readonly ICompanyRepository _companies;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCompanyHandler(
        ICompanyRepository companies,
        IUnitOfWork unitOfWork)
    {
        _companies = companies;
        _unitOfWork = unitOfWork;
    }

    public async Task<CompanyResponse?> Handle(
        UpdateCompanyCommand request,
        CancellationToken cancellationToken)
    {
        var company = await _companies.GetByIdAsync(request.Id, cancellationToken);

        if (company is null)
            return null;

        company.UpdateProfile(
            request.Name,
            request.Industry,
            request.LegalName,
            request.TaxId,
            request.Website,
            request.Email,
            request.Phone,
            request.Description,
            request.CompanySize,
            request.FoundedYear,
            request.Country,
            request.State,
            request.City,
            request.Address,
            request.PostalCode);

        await _companies.UpdateAsync(company, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return company.ToResponse();
    }
}

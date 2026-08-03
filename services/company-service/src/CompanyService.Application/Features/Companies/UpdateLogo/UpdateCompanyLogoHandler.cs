using CompanyService.Application.Features.Companies.Common;
using CompanyService.Application.Features.Companies.GetCompanies;
using CompanyService.Domain.Repositories;
using MediatR;

namespace CompanyService.Application.Features.Companies.UpdateLogo;

public sealed class UpdateCompanyLogoHandler
    : IRequestHandler<UpdateCompanyLogoCommand, CompanyResponse?>
{
    private readonly ICompanyRepository _companies;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCompanyLogoHandler(
        ICompanyRepository companies,
        IUnitOfWork unitOfWork)
    {
        _companies = companies;
        _unitOfWork = unitOfWork;
    }

    public async Task<CompanyResponse?> Handle(
        UpdateCompanyLogoCommand request,
        CancellationToken cancellationToken)
    {
        var company = await _companies.GetByIdAsync(request.Id, cancellationToken);

        if (company is null)
            return null;

        company.UpdateLogo(request.LogoUrl);

        await _companies.UpdateAsync(company, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return company.ToResponse();
    }
}

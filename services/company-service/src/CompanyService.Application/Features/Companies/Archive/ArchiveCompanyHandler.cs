using CompanyService.Application.Features.Companies.Common;
using CompanyService.Application.Features.Companies.GetCompanies;
using CompanyService.Domain.Repositories;
using MediatR;

namespace CompanyService.Application.Features.Companies.Archive;

public sealed class ArchiveCompanyHandler
    : IRequestHandler<ArchiveCompanyCommand, CompanyResponse?>
{
    private readonly ICompanyRepository _companies;
    private readonly IUnitOfWork _unitOfWork;

    public ArchiveCompanyHandler(
        ICompanyRepository companies,
        IUnitOfWork unitOfWork)
    {
        _companies = companies;
        _unitOfWork = unitOfWork;
    }

    public async Task<CompanyResponse?> Handle(
        ArchiveCompanyCommand request,
        CancellationToken cancellationToken)
    {
        var company = await _companies.GetByIdAsync(request.Id, cancellationToken);

        if (company is null)
            return null;

        company.Archive();

        await _companies.UpdateAsync(company, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return company.ToResponse();
    }
}

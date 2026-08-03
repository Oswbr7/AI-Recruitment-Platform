using CompanyService.Domain.Entities;
using CompanyService.Domain.Repositories;
using MediatR;

namespace CompanyService.Application.Features.Companies.Create;

public sealed class CreateCompanyHandler
    : IRequestHandler<CreateCompanyCommand, CreateCompanyResponse>
{
    private readonly ICompanyRepository _companies;
    private readonly IUnitOfWork _unitOfWork;

    public CreateCompanyHandler(
        ICompanyRepository companies,
        IUnitOfWork unitOfWork)
    {
        _companies = companies;
        _unitOfWork = unitOfWork;
    }

    public async Task<CreateCompanyResponse> Handle(
        CreateCompanyCommand request,
        CancellationToken cancellationToken)
    {
        var company = Company.Create(
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

        await _companies.AddAsync(company, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new CreateCompanyResponse(company.Id);
    }
}

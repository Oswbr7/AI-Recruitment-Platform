using CompanyService.Application.Features.Companies.GetCompanies;
using CompanyService.Domain.Entities;

namespace CompanyService.Application.Features.Companies.Common;

public static class CompanyResponseExtensions
{
    public static CompanyResponse ToResponse(this Company company)
    {
        return new CompanyResponse
        {
            Id = company.Id,
            Name = company.Name,
            LegalName = company.LegalName,
            TaxId = company.TaxId,
            Industry = company.Industry.ToString(),
            Website = company.Website,
            Email = company.Email,
            Phone = company.Phone,
            Description = company.Description,
            LogoUrl = company.LogoUrl,
            CompanySize = company.CompanySize?.ToString(),
            FoundedYear = company.FoundedYear,
            Country = company.Country,
            State = company.State,
            City = company.City,
            Address = company.Address,
            PostalCode = company.PostalCode,
            Status = company.Status.ToString(),
            CreatedAt = company.CreatedAt,
            UpdatedAt = company.UpdatedAt
        };
    }
}

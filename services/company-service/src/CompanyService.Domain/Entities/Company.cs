using CompanyService.Domain.Enums;

namespace CompanyService.Domain.Entities;

public class Company
{
    public Guid Id { get; private set; }

    public string Name { get; private set; }

    public string? LegalName { get; private set; }

    public string? TaxId { get; private set; }

    public Industry Industry { get; private set; }

    public string? Website { get; private set; }

    public string? Email { get; private set; }

    public string? Phone { get; private set; }

    public string? Description { get; private set; }

    public string? LogoUrl { get; private set; }

    public CompanySize? CompanySize { get; private set; }

    public int? FoundedYear { get; private set; }

    public string? Country { get; private set; }

    public string? State { get; private set; }

    public string? City { get; private set; }

    public string? Address { get; private set; }

    public string? PostalCode { get; private set; }

    public CompanyStatus Status { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public DateTime UpdatedAt { get; private set; }

    private Company() { }

    private Company(
        string name,
        Industry industry,
        string? legalName,
        string? taxId,
        string? website,
        string? email,
        string? phone,
        string? description,
        CompanySize? companySize,
        int? foundedYear,
        string? country,
        string? state,
        string? city,
        string? address,
        string? postalCode)
    {
        Id = Guid.NewGuid();

        Name = name;

        Industry = industry;

        LegalName = legalName;

        TaxId = taxId;

        Website = website;

        Email = email;

        Phone = phone;

        Description = description;

        CompanySize = companySize;

        FoundedYear = foundedYear;

        Country = country;

        State = state;

        City = city;

        Address = address;

        PostalCode = postalCode;

        Status = CompanyStatus.Active;

        CreatedAt = DateTime.UtcNow;

        UpdatedAt = DateTime.UtcNow;
    }

    public static Company Create(
        string name,
        Industry industry,
        string? legalName = null,
        string? taxId = null,
        string? website = null,
        string? email = null,
        string? phone = null,
        string? description = null,
        CompanySize? companySize = null,
        int? foundedYear = null,
        string? country = null,
        string? state = null,
        string? city = null,
        string? address = null,
        string? postalCode = null)
    {
        return new Company(
            name,
            industry,
            legalName,
            taxId,
            website,
            email,
            phone,
            description,
            companySize,
            foundedYear,
            country,
            state,
            city,
            address,
            postalCode);
    }

    public void UpdateProfile(
        string name,
        Industry industry,
        string? legalName,
        string? taxId,
        string? website,
        string? email,
        string? phone,
        string? description,
        CompanySize? companySize,
        int? foundedYear,
        string? country,
        string? state,
        string? city,
        string? address,
        string? postalCode)
    {
        Name = name;
        Industry = industry;
        LegalName = legalName;
        TaxId = taxId;
        Website = website;
        Email = email;
        Phone = phone;
        Description = description;
        CompanySize = companySize;
        FoundedYear = foundedYear;
        Country = country;
        State = state;
        City = city;
        Address = address;
        PostalCode = postalCode;

        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateLogo(string? logoUrl)
    {
        LogoUrl = logoUrl;

        UpdatedAt = DateTime.UtcNow;
    }

    public void Archive()
    {
        if (Status == CompanyStatus.Archived)
            throw new InvalidOperationException(
                "This company is already archived.");

        Status = CompanyStatus.Archived;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Restore()
    {
        if (Status == CompanyStatus.Active)
            throw new InvalidOperationException(
                "This company is already active.");

        Status = CompanyStatus.Active;
        UpdatedAt = DateTime.UtcNow;
    }
}

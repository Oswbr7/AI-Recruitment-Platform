namespace CompanyService.Application.Features.Companies.GetCompanies;

public sealed class CompanyResponse
{
    public Guid Id { get; init; }

    public string Name { get; init; } = string.Empty;

    public string? LegalName { get; init; }

    public string? TaxId { get; init; }

    public string Industry { get; init; } = string.Empty;

    public string? Website { get; init; }

    public string? Email { get; init; }

    public string? Phone { get; init; }

    public string? Description { get; init; }

    public string? LogoUrl { get; init; }

    public string? CompanySize { get; init; }

    public int? FoundedYear { get; init; }

    public string? Country { get; init; }

    public string? State { get; init; }

    public string? City { get; init; }

    public string? Address { get; init; }

    public string? PostalCode { get; init; }

    public string Status { get; init; } = string.Empty;

    public DateTime CreatedAt { get; init; }

    public DateTime UpdatedAt { get; init; }
}

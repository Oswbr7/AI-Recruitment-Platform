namespace CompanyService.Application.Features.Companies.Contacts.Common;

public sealed class CompanyContactResponse
{
    public Guid Id { get; init; }

    public Guid CompanyId { get; init; }

    public string FirstName { get; init; } = string.Empty;

    public string LastName { get; init; } = string.Empty;

    public string Email { get; init; } = string.Empty;

    public string? Phone { get; init; }

    public string? Position { get; init; }

    public bool IsPrimaryContact { get; init; }

    public DateTime CreatedAt { get; init; }

    public DateTime UpdatedAt { get; init; }
}

namespace CandidateService.Application.Features.Candidates.GetCandidates;

public sealed class CandidateResponse
{
    public Guid Id { get; init; }

    public string FirstName { get; init; } = string.Empty;

    public string LastName { get; init; } = string.Empty;

    public string Email { get; init; } = string.Empty;

    public string? Phone { get; init; }

    public string? Location { get; init; }

    public string? Headline { get; init; }

    public string? Summary { get; init; }

    public string? LinkedInUrl { get; init; }

    public string? GithubUrl { get; init; }

    public string? PortfolioUrl { get; init; }

    public string? CurrentCompany { get; init; }

    public string? CurrentPosition { get; init; }

    public int? YearsOfExperience { get; init; }

    public decimal? ExpectedSalary { get; init; }

    public string? Currency { get; init; }

    public string Stage { get; init; } = string.Empty;

    public string Status { get; init; } = string.Empty;

    public DateTime CreatedAt { get; init; }

    public DateTime UpdatedAt { get; init; }
}

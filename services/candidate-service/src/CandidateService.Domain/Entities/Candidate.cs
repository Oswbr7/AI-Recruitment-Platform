using CandidateService.Domain.Enums;

namespace CandidateService.Domain.Entities;

public class Candidate
{
    public Guid Id { get; private set; }

    public string FirstName { get; private set; }

    public string LastName { get; private set; }

    public string Email { get; private set; }

    public string? Phone { get; private set; }

    public string? Location { get; private set; }

    public string? Headline { get; private set; }

    public string? Summary { get; private set; }

    public string? LinkedInUrl { get; private set; }

    public string? GithubUrl { get; private set; }

    public string? PortfolioUrl { get; private set; }

    public string? CurrentCompany { get; private set; }

    public string? CurrentPosition { get; private set; }

    public int? YearsOfExperience { get; private set; }

    public decimal? ExpectedSalary { get; private set; }

    public string? Currency { get; private set; }

    public CandidateStage Stage { get; private set; }

    public CandidateStatus Status { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public DateTime UpdatedAt { get; private set; }

    private Candidate() { }

    private Candidate(
        string firstName,
        string lastName,
        string email,
        string? phone,
        string? location,
        string? headline,
        string? summary,
        string? linkedInUrl,
        string? githubUrl,
        string? portfolioUrl,
        string? currentCompany,
        string? currentPosition,
        int? yearsOfExperience,
        decimal? expectedSalary,
        string? currency)
    {
        Id = Guid.NewGuid();

        FirstName = firstName;

        LastName = lastName;

        Email = email;

        Phone = phone;

        Location = location;

        Headline = headline;

        Summary = summary;

        LinkedInUrl = linkedInUrl;

        GithubUrl = githubUrl;

        PortfolioUrl = portfolioUrl;

        CurrentCompany = currentCompany;

        CurrentPosition = currentPosition;

        YearsOfExperience = yearsOfExperience;

        ExpectedSalary = expectedSalary;

        Currency = currency;

        Stage = CandidateStage.Applied;

        Status = CandidateStatus.Active;

        CreatedAt = DateTime.UtcNow;

        UpdatedAt = DateTime.UtcNow;
    }

    public static Candidate Create(
        string firstName,
        string lastName,
        string email,
        string? phone = null,
        string? location = null,
        string? headline = null,
        string? summary = null,
        string? linkedInUrl = null,
        string? githubUrl = null,
        string? portfolioUrl = null,
        string? currentCompany = null,
        string? currentPosition = null,
        int? yearsOfExperience = null,
        decimal? expectedSalary = null,
        string? currency = null)
    {
        return new Candidate(
            firstName,
            lastName,
            email,
            phone,
            location,
            headline,
            summary,
            linkedInUrl,
            githubUrl,
            portfolioUrl,
            currentCompany,
            currentPosition,
            yearsOfExperience,
            expectedSalary,
            currency);
    }

    public void UpdateProfile(
        string firstName,
        string lastName,
        string email,
        string? phone,
        string? location,
        string? headline,
        string? summary,
        string? linkedInUrl,
        string? githubUrl,
        string? portfolioUrl,
        string? currentCompany,
        string? currentPosition,
        int? yearsOfExperience,
        decimal? expectedSalary,
        string? currency)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        Phone = phone;
        Location = location;
        Headline = headline;
        Summary = summary;
        LinkedInUrl = linkedInUrl;
        GithubUrl = githubUrl;
        PortfolioUrl = portfolioUrl;
        CurrentCompany = currentCompany;
        CurrentPosition = currentPosition;
        YearsOfExperience = yearsOfExperience;
        ExpectedSalary = expectedSalary;
        Currency = currency;

        UpdatedAt = DateTime.UtcNow;
    }

    public void MoveToStage(CandidateStage newStage)
    {
        if (Status == CandidateStatus.Archived)
            throw new InvalidOperationException(
                "Cannot move an archived candidate. Restore it first.");

        if (Stage == newStage)
            throw new InvalidOperationException(
                $"Candidate is already in stage '{Stage}'.");

        Stage = newStage;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Archive()
    {
        if (Status == CandidateStatus.Archived)
            throw new InvalidOperationException(
                "This candidate is already archived.");

        Status = CandidateStatus.Archived;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Restore()
    {
        if (Status == CandidateStatus.Active)
            throw new InvalidOperationException(
                "This candidate is already active.");

        Status = CandidateStatus.Active;
        UpdatedAt = DateTime.UtcNow;
    }
}

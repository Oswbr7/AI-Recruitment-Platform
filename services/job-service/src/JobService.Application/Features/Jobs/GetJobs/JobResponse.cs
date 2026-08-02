namespace JobService.Application.Jobs.Queries.GetJobs;

public sealed class JobResponse
{
    public Guid Id { get; init; }

    public string Title { get; init; } = string.Empty;

    public string Description { get; init; } = string.Empty;

    public string Department { get; init; } = string.Empty;

    public string Location { get; init; } = string.Empty;

    public string EmploymentType { get; init; } = string.Empty;

    public string ExperienceLevel { get; init; } = string.Empty;

    public string RemoteType { get; init; } = string.Empty;

    public decimal? SalaryMin { get; init; }

    public decimal? SalaryMax { get; init; }

    public string? Currency { get; init; }

    public string Status { get; init; } = string.Empty;

    public DateTime? PublishedAt { get; init; }

    public DateTime? ClosedAt { get; init; }

    public DateTime CreatedAt { get; init; }

    public DateTime UpdatedAt { get; init; }
}

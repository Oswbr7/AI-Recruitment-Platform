namespace JobService.Application.Jobs.Queries.GetJobs;

public sealed class JobResponse
{
    public Guid Id { get; init; }

    public string Title { get; init; } = string.Empty;

    public string Department { get; init; } = string.Empty;

    public string Location { get; init; } = string.Empty;

    public string Status { get; init; } = string.Empty;

    public DateTime CreatedAt { get; init; }
}
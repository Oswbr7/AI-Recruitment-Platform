namespace CandidateService.Application.Features.Applications.Common;

public sealed class ApplicationResponse
{
    public Guid Id { get; init; }

    public Guid CandidateId { get; init; }

    public Guid JobId { get; init; }

    public string Status { get; init; } = string.Empty;

    public string? Source { get; init; }

    public string? CoverNote { get; init; }

    public DateTime AppliedAt { get; init; }

    public DateTime UpdatedAt { get; init; }
}

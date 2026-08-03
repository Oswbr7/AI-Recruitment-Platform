namespace CandidateService.Application.Features.Candidates.Notes.Common;

public sealed class CandidateNoteResponse
{
    public Guid Id { get; init; }

    public Guid CandidateId { get; init; }

    public string Content { get; init; } = string.Empty;

    public DateTime CreatedAt { get; init; }

    public DateTime UpdatedAt { get; init; }
}

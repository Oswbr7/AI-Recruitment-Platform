namespace InterviewService.Application.Features.Interviews.GetInterviews;

public sealed class InterviewResponse
{
    public Guid Id { get; init; }

    public Guid CandidateId { get; init; }

    public Guid JobId { get; init; }

    public Guid RecruiterId { get; init; }

    public string Title { get; init; } = string.Empty;

    public string? Description { get; init; }

    public string InterviewType { get; init; } = string.Empty;

    public string InterviewStage { get; init; } = string.Empty;

    public DateTime ScheduledAt { get; init; }

    public int DurationMinutes { get; init; }

    public string? MeetingUrl { get; init; }

    public string? Location { get; init; }

    public string Status { get; init; } = string.Empty;

    public bool FeedbackSubmitted { get; init; }

    public decimal? OverallScore { get; init; }

    public DateTime CreatedAt { get; init; }

    public DateTime UpdatedAt { get; init; }
}

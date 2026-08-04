namespace InterviewService.Application.Features.Interviews.Feedback.Common;

public sealed class InterviewFeedbackResponse
{
    public Guid Id { get; init; }

    public Guid InterviewId { get; init; }

    public Guid ReviewerId { get; init; }

    public int TechnicalScore { get; init; }

    public int CommunicationScore { get; init; }

    public int ProblemSolvingScore { get; init; }

    public int CultureFitScore { get; init; }

    public string? Comments { get; init; }

    public string Recommendation { get; init; } = string.Empty;

    public DateTime CreatedAt { get; init; }
}

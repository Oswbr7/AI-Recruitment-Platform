using InterviewService.Domain.Enums;

namespace InterviewService.Domain.Entities;

public class InterviewFeedback
{
    public Guid Id { get; private set; }

    public Guid InterviewId { get; private set; }

    public Guid ReviewerId { get; private set; }

    public int TechnicalScore { get; private set; }

    public int CommunicationScore { get; private set; }

    public int ProblemSolvingScore { get; private set; }

    public int CultureFitScore { get; private set; }

    public string? Comments { get; private set; }

    public Recommendation Recommendation { get; private set; }

    public DateTime CreatedAt { get; private set; }

    private InterviewFeedback() { }

    private InterviewFeedback(
        Guid interviewId,
        Guid reviewerId,
        int technicalScore,
        int communicationScore,
        int problemSolvingScore,
        int cultureFitScore,
        string? comments,
        Recommendation recommendation)
    {
        Id = Guid.NewGuid();

        InterviewId = interviewId;

        ReviewerId = reviewerId;

        TechnicalScore = technicalScore;

        CommunicationScore = communicationScore;

        ProblemSolvingScore = problemSolvingScore;

        CultureFitScore = cultureFitScore;

        Comments = comments;

        Recommendation = recommendation;

        CreatedAt = DateTime.UtcNow;
    }

    public static InterviewFeedback Create(
        Guid interviewId,
        Guid reviewerId,
        int technicalScore,
        int communicationScore,
        int problemSolvingScore,
        int cultureFitScore,
        string? comments,
        Recommendation recommendation)
    {
        return new InterviewFeedback(
            interviewId,
            reviewerId,
            technicalScore,
            communicationScore,
            problemSolvingScore,
            cultureFitScore,
            comments,
            recommendation);
    }

    public decimal AverageScore =>
        (TechnicalScore + CommunicationScore + ProblemSolvingScore + CultureFitScore) / 4m;
}

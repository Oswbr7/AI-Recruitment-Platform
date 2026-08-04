using InterviewService.Domain.Entities;

namespace InterviewService.Application.Features.Interviews.Feedback.Common;

public static class InterviewFeedbackResponseExtensions
{
    public static InterviewFeedbackResponse ToResponse(this InterviewFeedback feedback)
    {
        return new InterviewFeedbackResponse
        {
            Id = feedback.Id,
            InterviewId = feedback.InterviewId,
            ReviewerId = feedback.ReviewerId,
            TechnicalScore = feedback.TechnicalScore,
            CommunicationScore = feedback.CommunicationScore,
            ProblemSolvingScore = feedback.ProblemSolvingScore,
            CultureFitScore = feedback.CultureFitScore,
            Comments = feedback.Comments,
            Recommendation = feedback.Recommendation.ToString(),
            CreatedAt = feedback.CreatedAt
        };
    }
}

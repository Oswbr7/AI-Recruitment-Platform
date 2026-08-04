using InterviewService.Application.Features.Interviews.GetInterviews;
using InterviewService.Domain.Entities;

namespace InterviewService.Application.Features.Interviews.Common;

public static class InterviewResponseExtensions
{
    public static InterviewResponse ToResponse(this Interview interview)
    {
        return new InterviewResponse
        {
            Id = interview.Id,
            CandidateId = interview.CandidateId,
            JobId = interview.JobId,
            RecruiterId = interview.RecruiterId,
            Title = interview.Title,
            Description = interview.Description,
            InterviewType = interview.InterviewType.ToString(),
            InterviewStage = interview.InterviewStage.ToString(),
            ScheduledAt = interview.ScheduledAt,
            DurationMinutes = interview.DurationMinutes,
            MeetingUrl = interview.MeetingUrl,
            Location = interview.Location,
            Status = interview.Status.ToString(),
            FeedbackSubmitted = interview.FeedbackSubmitted,
            OverallScore = interview.OverallScore,
            CreatedAt = interview.CreatedAt,
            UpdatedAt = interview.UpdatedAt
        };
    }
}

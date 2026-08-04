using InterviewService.Domain.Enums;

namespace InterviewService.Domain.Entities;

public class Interview
{
    public Guid Id { get; private set; }

    public Guid CandidateId { get; private set; }

    public Guid JobId { get; private set; }

    public Guid RecruiterId { get; private set; }

    public string Title { get; private set; }

    public string? Description { get; private set; }

    public InterviewType InterviewType { get; private set; }

    public InterviewStage InterviewStage { get; private set; }

    public DateTime ScheduledAt { get; private set; }

    public int DurationMinutes { get; private set; }

    public string? MeetingUrl { get; private set; }

    public string? Location { get; private set; }

    public InterviewStatus Status { get; private set; }

    public bool FeedbackSubmitted { get; private set; }

    public decimal? OverallScore { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public DateTime UpdatedAt { get; private set; }

    private Interview() { }

    private Interview(
        Guid candidateId,
        Guid jobId,
        Guid recruiterId,
        string title,
        string? description,
        InterviewType interviewType,
        InterviewStage interviewStage,
        DateTime scheduledAt,
        int durationMinutes,
        string? meetingUrl,
        string? location)
    {
        Id = Guid.NewGuid();

        CandidateId = candidateId;

        JobId = jobId;

        RecruiterId = recruiterId;

        Title = title;

        Description = description;

        InterviewType = interviewType;

        InterviewStage = interviewStage;

        ScheduledAt = scheduledAt;

        DurationMinutes = durationMinutes;

        MeetingUrl = meetingUrl;

        Location = location;

        Status = InterviewStatus.Scheduled;

        FeedbackSubmitted = false;

        CreatedAt = DateTime.UtcNow;

        UpdatedAt = DateTime.UtcNow;
    }

    public static Interview Schedule(
        Guid candidateId,
        Guid jobId,
        Guid recruiterId,
        string title,
        string? description,
        InterviewType interviewType,
        InterviewStage interviewStage,
        DateTime scheduledAt,
        int durationMinutes,
        string? meetingUrl = null,
        string? location = null)
    {
        return new Interview(
            candidateId,
            jobId,
            recruiterId,
            title,
            description,
            interviewType,
            interviewStage,
            scheduledAt,
            durationMinutes,
            meetingUrl,
            location);
    }

    public void Update(
        string title,
        string? description,
        InterviewType interviewType,
        InterviewStage interviewStage,
        int durationMinutes,
        string? meetingUrl,
        string? location)
    {
        Title = title;
        Description = description;
        InterviewType = interviewType;
        InterviewStage = interviewStage;
        DurationMinutes = durationMinutes;
        MeetingUrl = meetingUrl;
        Location = location;

        UpdatedAt = DateTime.UtcNow;
    }

    public void Reschedule(DateTime newScheduledAt)
    {
        if (Status != InterviewStatus.Scheduled)
            throw new InvalidOperationException(
                $"Cannot reschedule an interview in '{Status}' status. Only scheduled interviews can be rescheduled.");

        ScheduledAt = newScheduledAt;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Cancel()
    {
        if (Status != InterviewStatus.Scheduled)
            throw new InvalidOperationException(
                $"Cannot cancel an interview in '{Status}' status. Only scheduled interviews can be cancelled.");

        Status = InterviewStatus.Cancelled;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Complete()
    {
        if (Status != InterviewStatus.Scheduled)
            throw new InvalidOperationException(
                $"Cannot complete an interview in '{Status}' status. Only scheduled interviews can be completed.");

        Status = InterviewStatus.Completed;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SubmitFeedback(decimal overallScore)
    {
        FeedbackSubmitted = true;
        OverallScore = overallScore;

        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangeMeetingLink(string? meetingUrl)
    {
        MeetingUrl = meetingUrl;

        UpdatedAt = DateTime.UtcNow;
    }
}

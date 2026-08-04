using InterviewService.Domain.Enums;
using MediatR;

namespace InterviewService.Application.Features.Interviews.Schedule;

public record ScheduleInterviewCommand(
    Guid CandidateId,
    Guid JobId,
    Guid RecruiterId,
    string Title,
    string? Description,
    InterviewType InterviewType,
    InterviewStage InterviewStage,
    DateTime ScheduledAt,
    int DurationMinutes,
    string? MeetingUrl,
    string? Location) : IRequest<ScheduleInterviewResponse>;

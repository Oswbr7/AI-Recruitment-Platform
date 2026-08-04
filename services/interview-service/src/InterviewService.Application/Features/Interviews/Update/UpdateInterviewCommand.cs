using InterviewService.Application.Features.Interviews.GetInterviews;
using InterviewService.Domain.Enums;
using MediatR;

namespace InterviewService.Application.Features.Interviews.Update;

public record UpdateInterviewCommand(
    Guid Id,
    string Title,
    string? Description,
    InterviewType InterviewType,
    InterviewStage InterviewStage,
    int DurationMinutes,
    string? MeetingUrl,
    string? Location) : IRequest<InterviewResponse?>;

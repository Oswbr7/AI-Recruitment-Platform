using InterviewService.Application.Features.Interviews.GetInterviews;
using MediatR;

namespace InterviewService.Application.Features.Interviews.Reschedule;

public sealed record RescheduleInterviewCommand(Guid Id, DateTime ScheduledAt) : IRequest<InterviewResponse?>;

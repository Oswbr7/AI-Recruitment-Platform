using InterviewService.Application.Features.Interviews.GetInterviews;
using MediatR;

namespace InterviewService.Application.Features.Interviews.Complete;

public sealed record CompleteInterviewCommand(Guid Id) : IRequest<InterviewResponse?>;

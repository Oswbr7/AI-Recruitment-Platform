using InterviewService.Application.Features.Interviews.GetInterviews;
using MediatR;

namespace InterviewService.Application.Features.Interviews.Cancel;

public sealed record CancelInterviewCommand(Guid Id) : IRequest<InterviewResponse?>;

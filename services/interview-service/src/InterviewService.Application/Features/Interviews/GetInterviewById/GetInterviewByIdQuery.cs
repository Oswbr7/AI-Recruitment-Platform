using InterviewService.Application.Features.Interviews.GetInterviews;
using MediatR;

namespace InterviewService.Application.Features.Interviews.GetInterviewById;

public sealed record GetInterviewByIdQuery(Guid Id) : IRequest<InterviewResponse?>;

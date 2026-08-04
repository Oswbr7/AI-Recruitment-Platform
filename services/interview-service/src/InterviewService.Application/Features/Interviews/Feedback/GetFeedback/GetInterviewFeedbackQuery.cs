using InterviewService.Application.Features.Interviews.Feedback.Common;
using MediatR;

namespace InterviewService.Application.Features.Interviews.Feedback.GetFeedback;

public sealed record GetInterviewFeedbackQuery(Guid InterviewId) : IRequest<List<InterviewFeedbackResponse>?>;

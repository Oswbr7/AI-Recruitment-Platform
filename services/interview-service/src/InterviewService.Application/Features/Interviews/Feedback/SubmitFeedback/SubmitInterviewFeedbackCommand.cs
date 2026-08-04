using InterviewService.Application.Features.Interviews.Feedback.Common;
using InterviewService.Domain.Enums;
using MediatR;

namespace InterviewService.Application.Features.Interviews.Feedback.SubmitFeedback;

public sealed record SubmitInterviewFeedbackCommand(
    Guid InterviewId,
    Guid ReviewerId,
    int TechnicalScore,
    int CommunicationScore,
    int ProblemSolvingScore,
    int CultureFitScore,
    string? Comments,
    Recommendation Recommendation) : IRequest<InterviewFeedbackResponse?>;

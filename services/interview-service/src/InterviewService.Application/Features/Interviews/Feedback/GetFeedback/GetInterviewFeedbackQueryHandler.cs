using InterviewService.Application.Features.Interviews.Feedback.Common;
using InterviewService.Domain.Repositories;
using MediatR;

namespace InterviewService.Application.Features.Interviews.Feedback.GetFeedback;

public sealed class GetInterviewFeedbackQueryHandler
    : IRequestHandler<GetInterviewFeedbackQuery, List<InterviewFeedbackResponse>?>
{
    private readonly IInterviewRepository _interviews;
    private readonly IInterviewFeedbackRepository _feedbacks;

    public GetInterviewFeedbackQueryHandler(
        IInterviewRepository interviews,
        IInterviewFeedbackRepository feedbacks)
    {
        _interviews = interviews;
        _feedbacks = feedbacks;
    }

    public async Task<List<InterviewFeedbackResponse>?> Handle(
        GetInterviewFeedbackQuery request,
        CancellationToken cancellationToken)
    {
        var interviewExists = await _interviews.ExistsAsync(request.InterviewId, cancellationToken);

        if (!interviewExists)
            return null;

        var feedbacks = await _feedbacks.GetByInterviewIdAsync(request.InterviewId, cancellationToken);

        return feedbacks.Select(x => x.ToResponse()).ToList();
    }
}

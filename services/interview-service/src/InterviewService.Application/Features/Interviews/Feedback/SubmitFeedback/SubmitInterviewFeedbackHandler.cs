using InterviewService.Application.Features.Interviews.Feedback.Common;
using InterviewService.Domain.Entities;
using InterviewService.Domain.Repositories;
using MediatR;

namespace InterviewService.Application.Features.Interviews.Feedback.SubmitFeedback;

public sealed class SubmitInterviewFeedbackHandler
    : IRequestHandler<SubmitInterviewFeedbackCommand, InterviewFeedbackResponse?>
{
    private readonly IInterviewRepository _interviews;
    private readonly IInterviewFeedbackRepository _feedbacks;
    private readonly IUnitOfWork _unitOfWork;

    public SubmitInterviewFeedbackHandler(
        IInterviewRepository interviews,
        IInterviewFeedbackRepository feedbacks,
        IUnitOfWork unitOfWork)
    {
        _interviews = interviews;
        _feedbacks = feedbacks;
        _unitOfWork = unitOfWork;
    }

    public async Task<InterviewFeedbackResponse?> Handle(
        SubmitInterviewFeedbackCommand request,
        CancellationToken cancellationToken)
    {
        var interview = await _interviews.GetByIdAsync(request.InterviewId, cancellationToken);

        if (interview is null)
            return null;

        var existingFeedbacks = await _feedbacks.GetByInterviewIdAsync(request.InterviewId, cancellationToken);

        var feedback = InterviewFeedback.Create(
            request.InterviewId,
            request.ReviewerId,
            request.TechnicalScore,
            request.CommunicationScore,
            request.ProblemSolvingScore,
            request.CultureFitScore,
            request.Comments,
            request.Recommendation);

        await _feedbacks.AddAsync(feedback, cancellationToken);

        var totalScore = existingFeedbacks.Sum(x => x.AverageScore) + feedback.AverageScore;

        var overallScore = totalScore / (existingFeedbacks.Count + 1);

        interview.SubmitFeedback(overallScore);

        await _interviews.UpdateAsync(interview, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return feedback.ToResponse();
    }
}

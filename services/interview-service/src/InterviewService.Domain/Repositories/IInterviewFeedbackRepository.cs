using InterviewService.Domain.Entities;

namespace InterviewService.Domain.Repositories;

public interface IInterviewFeedbackRepository
{
    Task AddAsync(InterviewFeedback feedback, CancellationToken cancellationToken);

    Task<List<InterviewFeedback>> GetByInterviewIdAsync(Guid interviewId, CancellationToken cancellationToken);
}

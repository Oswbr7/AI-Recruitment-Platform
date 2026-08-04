using InterviewService.Domain.Entities;
using InterviewService.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace InterviewService.Infrastructure.Persistence.Repositories;

public class InterviewFeedbackRepository : IInterviewFeedbackRepository
{
    private readonly ApplicationDbContext _context;

    public InterviewFeedbackRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(InterviewFeedback feedback, CancellationToken cancellationToken)
    {
        await _context.InterviewFeedbacks.AddAsync(feedback, cancellationToken);
    }

    public async Task<List<InterviewFeedback>> GetByInterviewIdAsync(Guid interviewId, CancellationToken cancellationToken)
    {
        return await _context.InterviewFeedbacks
            .AsNoTracking()
            .Where(x => x.InterviewId == interviewId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}

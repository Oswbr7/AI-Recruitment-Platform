using InterviewService.Domain.Entities;
using InterviewService.Domain.Enums;
using InterviewService.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace InterviewService.Infrastructure.Persistence.Repositories;

public class InterviewRepository : IInterviewRepository
{
    private readonly ApplicationDbContext _context;

    public InterviewRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Interview interview, CancellationToken cancellationToken)
    {
        await _context.Interviews.AddAsync(interview, cancellationToken);
    }

    public async Task<Interview?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.Interviews
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<(List<Interview> Items, int TotalCount)> GetPagedAsync(
        int page,
        int pageSize,
        string? search,
        Guid? candidateId,
        Guid? jobId,
        Guid? recruiterId,
        InterviewStatus? status,
        InterviewStage? stage,
        DateTime? dateFrom,
        DateTime? dateTo,
        string? sortBy,
        string? sortDirection,
        CancellationToken cancellationToken)
    {
        var query = _context.Interviews
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();

            query = query.Where(x => x.Title.ToLower().Contains(term));
        }

        if (candidateId.HasValue)
            query = query.Where(x => x.CandidateId == candidateId.Value);

        if (jobId.HasValue)
            query = query.Where(x => x.JobId == jobId.Value);

        if (recruiterId.HasValue)
            query = query.Where(x => x.RecruiterId == recruiterId.Value);

        if (status.HasValue)
            query = query.Where(x => x.Status == status.Value);

        if (stage.HasValue)
            query = query.Where(x => x.InterviewStage == stage.Value);

        if (dateFrom.HasValue)
            query = query.Where(x => x.ScheduledAt >= dateFrom.Value);

        if (dateTo.HasValue)
            query = query.Where(x => x.ScheduledAt <= dateTo.Value);

        var totalCount = await query.CountAsync(cancellationToken);

        var descending = string.Equals(
            sortDirection,
            "desc",
            StringComparison.OrdinalIgnoreCase);

        query = sortBy?.ToLowerInvariant() switch
        {
            "title" => descending
                ? query.OrderByDescending(x => x.Title)
                : query.OrderBy(x => x.Title),

            "status" => descending
                ? query.OrderByDescending(x => x.Status)
                : query.OrderBy(x => x.Status),

            "stage" => descending
                ? query.OrderByDescending(x => x.InterviewStage)
                : query.OrderBy(x => x.InterviewStage),

            "updatedat" => descending
                ? query.OrderByDescending(x => x.UpdatedAt)
                : query.OrderBy(x => x.UpdatedAt),

            _ => descending
                ? query.OrderByDescending(x => x.ScheduledAt)
                : query.OrderBy(x => x.ScheduledAt),
        };

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public Task UpdateAsync(Interview interview, CancellationToken cancellationToken)
    {
        _context.Interviews.Update(interview);

        return Task.CompletedTask;
    }

    public Task DeleteAsync(Interview interview, CancellationToken cancellationToken)
    {
        _context.Interviews.Remove(interview);

        return Task.CompletedTask;
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.Interviews
            .AnyAsync(x => x.Id == id, cancellationToken);
    }
}

using CandidateService.Domain.Entities;
using CandidateService.Domain.Enums;
using CandidateService.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CandidateService.Infrastructure.Persistence.Repositories;

public class JobApplicationRepository : IJobApplicationRepository
{
    private readonly ApplicationDbContext _context;

    public JobApplicationRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(JobApplication application, CancellationToken cancellationToken)
    {
        await _context.JobApplications.AddAsync(application, cancellationToken);
    }

    public async Task<JobApplication?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.JobApplications
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<(List<JobApplication> Items, int TotalCount)> GetPagedAsync(
        int page,
        int pageSize,
        Guid? candidateId,
        Guid? jobId,
        ApplicationStatus? status,
        string? sortBy,
        string? sortDirection,
        CancellationToken cancellationToken)
    {
        var query = _context.JobApplications
            .AsNoTracking()
            .AsQueryable();

        if (candidateId.HasValue)
            query = query.Where(x => x.CandidateId == candidateId.Value);

        if (jobId.HasValue)
            query = query.Where(x => x.JobId == jobId.Value);

        if (status.HasValue)
            query = query.Where(x => x.Status == status.Value);

        var totalCount = await query.CountAsync(cancellationToken);

        var descending = string.Equals(
            sortDirection,
            "desc",
            StringComparison.OrdinalIgnoreCase);

        query = sortBy?.ToLowerInvariant() switch
        {
            "status" => descending
                ? query.OrderByDescending(x => x.Status)
                : query.OrderBy(x => x.Status),

            "updatedat" => descending
                ? query.OrderByDescending(x => x.UpdatedAt)
                : query.OrderBy(x => x.UpdatedAt),

            _ => descending
                ? query.OrderByDescending(x => x.AppliedAt)
                : query.OrderBy(x => x.AppliedAt),
        };

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public Task UpdateAsync(JobApplication application, CancellationToken cancellationToken)
    {
        _context.JobApplications.Update(application);

        return Task.CompletedTask;
    }

    public async Task<bool> ExistsActiveForCandidateAndJobAsync(
        Guid candidateId,
        Guid jobId,
        CancellationToken cancellationToken)
    {
        return await _context.JobApplications
            .AsNoTracking()
            .AnyAsync(x =>
                    x.CandidateId == candidateId &&
                    x.JobId == jobId &&
                    x.Status != ApplicationStatus.Rejected &&
                    x.Status != ApplicationStatus.Withdrawn,
                cancellationToken);
    }
}

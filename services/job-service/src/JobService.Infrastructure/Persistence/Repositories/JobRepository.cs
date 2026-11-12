using JobService.Domain.Entities;
using JobService.Domain.Enums;
using JobService.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace JobService.Infrastructure.Persistence.Repositories;

public class JobRepository : IJobRepository
{
    private readonly ApplicationDbContext _context;

    public JobRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Job job, CancellationToken cancellationToken)
    {
        // await _context.Jobs.AddAsync(job, cancellationToken);
        // await _context.SaveChangesAsync(cancellationToken);
        await _context.Jobs.AddAsync(job, cancellationToken);
    }

    public async Task<Job?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.Jobs
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<(List<Job> Items, int TotalCount)> GetPagedAsync(
        int page,
        int pageSize,
        string? search,
        JobStatus? status,
        Guid? companyId,
        string? sortBy,
        string? sortDirection,
        CancellationToken cancellationToken)
    {
        var query = _context.Jobs
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();

            query = query.Where(x =>
                x.Title.ToLower().Contains(term) ||
                x.Department.ToLower().Contains(term) ||
                x.Location.ToLower().Contains(term));
        }

        if (status.HasValue)
            query = query.Where(x => x.Status == status.Value);

        if (companyId.HasValue)
            query = query.Where(x => x.CompanyId == companyId.Value);

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

            "location" => descending
                ? query.OrderByDescending(x => x.Location)
                : query.OrderBy(x => x.Location),

            "status" => descending
                ? query.OrderByDescending(x => x.Status)
                : query.OrderBy(x => x.Status),

            _ => descending
                ? query.OrderByDescending(x => x.CreatedAt)
                : query.OrderBy(x => x.CreatedAt),
        };

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public Task UpdateAsync(Job job, CancellationToken cancellationToken)
    {
        _context.Jobs.Update(job);

        // await _context.SaveChangesAsync(cancellationToken);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Job job, CancellationToken cancellationToken)
    {
        _context.Jobs.Remove(job);

        // await _context.SaveChangesAsync(cancellationToken);
        return Task.CompletedTask;
    }
}
using CandidateService.Domain.Entities;
using CandidateService.Domain.Enums;
using CandidateService.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CandidateService.Infrastructure.Persistence.Repositories;

public class CandidateRepository : ICandidateRepository
{
    private readonly ApplicationDbContext _context;

    public CandidateRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Candidate candidate, CancellationToken cancellationToken)
    {
        await _context.Candidates.AddAsync(candidate, cancellationToken);
    }

    public async Task<Candidate?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.Candidates
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<(List<Candidate> Items, int TotalCount)> GetPagedAsync(
        int page,
        int pageSize,
        string? search,
        CandidateStage? stage,
        CandidateStatus? status,
        string? sortBy,
        string? sortDirection,
        CancellationToken cancellationToken)
    {
        var query = _context.Candidates
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();

            query = query.Where(x =>
                x.FirstName.ToLower().Contains(term) ||
                x.LastName.ToLower().Contains(term) ||
                x.Email.ToLower().Contains(term));
        }

        if (stage.HasValue)
            query = query.Where(x => x.Stage == stage.Value);

        if (status.HasValue)
            query = query.Where(x => x.Status == status.Value);

        var totalCount = await query.CountAsync(cancellationToken);

        var descending = string.Equals(
            sortDirection,
            "desc",
            StringComparison.OrdinalIgnoreCase);

        query = sortBy?.ToLowerInvariant() switch
        {
            "firstname" => descending
                ? query.OrderByDescending(x => x.FirstName)
                : query.OrderBy(x => x.FirstName),

            "lastname" => descending
                ? query.OrderByDescending(x => x.LastName)
                : query.OrderBy(x => x.LastName),

            "email" => descending
                ? query.OrderByDescending(x => x.Email)
                : query.OrderBy(x => x.Email),

            "stage" => descending
                ? query.OrderByDescending(x => x.Stage)
                : query.OrderBy(x => x.Stage),

            "updatedat" => descending
                ? query.OrderByDescending(x => x.UpdatedAt)
                : query.OrderBy(x => x.UpdatedAt),

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

    public Task UpdateAsync(Candidate candidate, CancellationToken cancellationToken)
    {
        _context.Candidates.Update(candidate);

        return Task.CompletedTask;
    }

    public Task DeleteAsync(Candidate candidate, CancellationToken cancellationToken)
    {
        _context.Candidates.Remove(candidate);

        return Task.CompletedTask;
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.Candidates
            .AnyAsync(x => x.Id == id, cancellationToken);
    }
}

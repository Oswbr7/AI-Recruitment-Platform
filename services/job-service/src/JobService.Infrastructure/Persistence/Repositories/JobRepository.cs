using JobService.Domain.Entities;
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

    public async Task<List<Job>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _context.Jobs
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
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
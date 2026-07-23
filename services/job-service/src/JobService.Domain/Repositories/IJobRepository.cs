using JobService.Domain.Entities;

namespace JobService.Domain.Repositories;

public interface IJobRepository
{
    Task AddAsync(Job job, CancellationToken cancellationToken);

    Task<Job?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<List<Job>> GetAllAsync(CancellationToken cancellationToken);

    Task UpdateAsync(Job job, CancellationToken cancellationToken);

    Task DeleteAsync(Job job, CancellationToken cancellationToken);
}
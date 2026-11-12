using JobService.Domain.Entities;
using JobService.Domain.Enums;

namespace JobService.Domain.Repositories;

public interface IJobRepository
{
    Task AddAsync(Job job, CancellationToken cancellationToken);

    Task<Job?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<(List<Job> Items, int TotalCount)> GetPagedAsync(
        int page,
        int pageSize,
        string? search,
        JobStatus? status,
        Guid? companyId,
        string? sortBy,
        string? sortDirection,
        CancellationToken cancellationToken);

    Task UpdateAsync(Job job, CancellationToken cancellationToken);

    Task DeleteAsync(Job job, CancellationToken cancellationToken);
}
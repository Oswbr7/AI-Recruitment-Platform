using InterviewService.Domain.Entities;
using InterviewService.Domain.Enums;

namespace InterviewService.Domain.Repositories;

public interface IInterviewRepository
{
    Task AddAsync(Interview interview, CancellationToken cancellationToken);

    Task<Interview?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<(List<Interview> Items, int TotalCount)> GetPagedAsync(
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
        CancellationToken cancellationToken);

    Task UpdateAsync(Interview interview, CancellationToken cancellationToken);

    Task DeleteAsync(Interview interview, CancellationToken cancellationToken);

    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken);
}

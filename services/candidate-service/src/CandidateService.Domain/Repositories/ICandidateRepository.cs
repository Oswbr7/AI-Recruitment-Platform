using CandidateService.Domain.Entities;
using CandidateService.Domain.Enums;

namespace CandidateService.Domain.Repositories;

public interface ICandidateRepository
{
    Task AddAsync(Candidate candidate, CancellationToken cancellationToken);

    Task<Candidate?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<(List<Candidate> Items, int TotalCount)> GetPagedAsync(
        int page,
        int pageSize,
        string? search,
        CandidateStage? stage,
        CandidateStatus? status,
        string? sortBy,
        string? sortDirection,
        CancellationToken cancellationToken);

    Task UpdateAsync(Candidate candidate, CancellationToken cancellationToken);

    Task DeleteAsync(Candidate candidate, CancellationToken cancellationToken);

    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken);
}

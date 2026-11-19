using CandidateService.Domain.Entities;
using CandidateService.Domain.Enums;

namespace CandidateService.Domain.Repositories;

public interface IJobApplicationRepository
{
    Task AddAsync(JobApplication application, CancellationToken cancellationToken);

    Task<JobApplication?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<(List<JobApplication> Items, int TotalCount)> GetPagedAsync(
        int page,
        int pageSize,
        Guid? candidateId,
        Guid? jobId,
        ApplicationStatus? status,
        string? sortBy,
        string? sortDirection,
        CancellationToken cancellationToken);

    Task UpdateAsync(JobApplication application, CancellationToken cancellationToken);

    /// <summary>
    /// true si ya existe una aplicación NO terminal para el par
    /// candidato+vacante (una por par en vuelo, sin límite histórico).
    /// </summary>
    Task<bool> ExistsActiveForCandidateAndJobAsync(
        Guid candidateId,
        Guid jobId,
        CancellationToken cancellationToken);
}

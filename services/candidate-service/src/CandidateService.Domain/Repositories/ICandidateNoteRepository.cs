using CandidateService.Domain.Entities;

namespace CandidateService.Domain.Repositories;

public interface ICandidateNoteRepository
{
    Task AddAsync(CandidateNote note, CancellationToken cancellationToken);

    Task<CandidateNote?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<List<CandidateNote>> GetByCandidateIdAsync(Guid candidateId, CancellationToken cancellationToken);

    Task UpdateAsync(CandidateNote note, CancellationToken cancellationToken);

    Task DeleteAsync(CandidateNote note, CancellationToken cancellationToken);
}

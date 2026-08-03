using CandidateService.Domain.Entities;
using CandidateService.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CandidateService.Infrastructure.Persistence.Repositories;

public class CandidateNoteRepository : ICandidateNoteRepository
{
    private readonly ApplicationDbContext _context;

    public CandidateNoteRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(CandidateNote note, CancellationToken cancellationToken)
    {
        await _context.CandidateNotes.AddAsync(note, cancellationToken);
    }

    public async Task<CandidateNote?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.CandidateNotes
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<List<CandidateNote>> GetByCandidateIdAsync(Guid candidateId, CancellationToken cancellationToken)
    {
        return await _context.CandidateNotes
            .AsNoTracking()
            .Where(x => x.CandidateId == candidateId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public Task UpdateAsync(CandidateNote note, CancellationToken cancellationToken)
    {
        _context.CandidateNotes.Update(note);

        return Task.CompletedTask;
    }

    public Task DeleteAsync(CandidateNote note, CancellationToken cancellationToken)
    {
        _context.CandidateNotes.Remove(note);

        return Task.CompletedTask;
    }
}

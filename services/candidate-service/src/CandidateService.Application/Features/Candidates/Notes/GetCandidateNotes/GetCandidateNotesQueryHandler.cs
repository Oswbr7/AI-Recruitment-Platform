using CandidateService.Application.Features.Candidates.Notes.Common;
using CandidateService.Domain.Repositories;
using MediatR;

namespace CandidateService.Application.Features.Candidates.Notes.GetCandidateNotes;

public sealed class GetCandidateNotesQueryHandler
    : IRequestHandler<GetCandidateNotesQuery, List<CandidateNoteResponse>?>
{
    private readonly ICandidateRepository _candidates;
    private readonly ICandidateNoteRepository _notes;

    public GetCandidateNotesQueryHandler(
        ICandidateRepository candidates,
        ICandidateNoteRepository notes)
    {
        _candidates = candidates;
        _notes = notes;
    }

    public async Task<List<CandidateNoteResponse>?> Handle(
        GetCandidateNotesQuery request,
        CancellationToken cancellationToken)
    {
        var candidateExists = await _candidates.ExistsAsync(request.CandidateId, cancellationToken);

        if (!candidateExists)
            return null;

        var notes = await _notes.GetByCandidateIdAsync(request.CandidateId, cancellationToken);

        return notes.Select(x => x.ToResponse()).ToList();
    }
}

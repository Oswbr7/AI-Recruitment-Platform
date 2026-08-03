using CandidateService.Application.Features.Candidates.Notes.Common;
using CandidateService.Domain.Entities;
using CandidateService.Domain.Repositories;
using MediatR;

namespace CandidateService.Application.Features.Candidates.Notes.AddCandidateNote;

public sealed class AddCandidateNoteHandler
    : IRequestHandler<AddCandidateNoteCommand, CandidateNoteResponse?>
{
    private readonly ICandidateRepository _candidates;
    private readonly ICandidateNoteRepository _notes;
    private readonly IUnitOfWork _unitOfWork;

    public AddCandidateNoteHandler(
        ICandidateRepository candidates,
        ICandidateNoteRepository notes,
        IUnitOfWork unitOfWork)
    {
        _candidates = candidates;
        _notes = notes;
        _unitOfWork = unitOfWork;
    }

    public async Task<CandidateNoteResponse?> Handle(
        AddCandidateNoteCommand request,
        CancellationToken cancellationToken)
    {
        var candidateExists = await _candidates.ExistsAsync(request.CandidateId, cancellationToken);

        if (!candidateExists)
            return null;

        var note = CandidateNote.Create(request.CandidateId, request.Content);

        await _notes.AddAsync(note, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return note.ToResponse();
    }
}

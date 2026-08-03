using CandidateService.Application.Features.Candidates.Notes.Common;
using CandidateService.Domain.Repositories;
using MediatR;

namespace CandidateService.Application.Features.Candidates.Notes.UpdateCandidateNote;

public sealed class UpdateCandidateNoteHandler
    : IRequestHandler<UpdateCandidateNoteCommand, CandidateNoteResponse?>
{
    private readonly ICandidateNoteRepository _notes;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCandidateNoteHandler(
        ICandidateNoteRepository notes,
        IUnitOfWork unitOfWork)
    {
        _notes = notes;
        _unitOfWork = unitOfWork;
    }

    public async Task<CandidateNoteResponse?> Handle(
        UpdateCandidateNoteCommand request,
        CancellationToken cancellationToken)
    {
        var note = await _notes.GetByIdAsync(request.Id, cancellationToken);

        if (note is null)
            return null;

        note.UpdateContent(request.Content);

        await _notes.UpdateAsync(note, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return note.ToResponse();
    }
}

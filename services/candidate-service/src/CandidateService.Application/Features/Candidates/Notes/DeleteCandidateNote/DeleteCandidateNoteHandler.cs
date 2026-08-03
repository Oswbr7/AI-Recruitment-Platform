using CandidateService.Domain.Repositories;
using MediatR;

namespace CandidateService.Application.Features.Candidates.Notes.DeleteCandidateNote;

public sealed class DeleteCandidateNoteHandler
    : IRequestHandler<DeleteCandidateNoteCommand, bool>
{
    private readonly ICandidateNoteRepository _notes;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteCandidateNoteHandler(
        ICandidateNoteRepository notes,
        IUnitOfWork unitOfWork)
    {
        _notes = notes;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(
        DeleteCandidateNoteCommand request,
        CancellationToken cancellationToken)
    {
        var note = await _notes.GetByIdAsync(request.Id, cancellationToken);

        if (note is null)
            return false;

        await _notes.DeleteAsync(note, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}

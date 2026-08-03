using MediatR;

namespace CandidateService.Application.Features.Candidates.Notes.DeleteCandidateNote;

public sealed record DeleteCandidateNoteCommand(Guid Id) : IRequest<bool>;

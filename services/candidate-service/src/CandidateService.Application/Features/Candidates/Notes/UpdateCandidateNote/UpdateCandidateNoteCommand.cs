using CandidateService.Application.Features.Candidates.Notes.Common;
using MediatR;

namespace CandidateService.Application.Features.Candidates.Notes.UpdateCandidateNote;

public sealed record UpdateCandidateNoteCommand(Guid Id, string Content) : IRequest<CandidateNoteResponse?>;

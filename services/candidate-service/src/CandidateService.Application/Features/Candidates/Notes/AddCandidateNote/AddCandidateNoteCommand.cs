using CandidateService.Application.Features.Candidates.Notes.Common;
using MediatR;

namespace CandidateService.Application.Features.Candidates.Notes.AddCandidateNote;

public sealed record AddCandidateNoteCommand(Guid CandidateId, string Content) : IRequest<CandidateNoteResponse?>;

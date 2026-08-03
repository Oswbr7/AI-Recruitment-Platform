using CandidateService.Application.Features.Candidates.Notes.Common;
using MediatR;

namespace CandidateService.Application.Features.Candidates.Notes.GetCandidateNotes;

public sealed record GetCandidateNotesQuery(Guid CandidateId) : IRequest<List<CandidateNoteResponse>?>;

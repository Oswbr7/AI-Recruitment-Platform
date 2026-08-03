using CandidateService.Application.Features.Candidates.GetCandidates;
using MediatR;

namespace CandidateService.Application.Features.Candidates.Restore;

public sealed record RestoreCandidateCommand(Guid Id) : IRequest<CandidateResponse?>;

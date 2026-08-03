using CandidateService.Application.Features.Candidates.GetCandidates;
using MediatR;

namespace CandidateService.Application.Features.Candidates.Archive;

public sealed record ArchiveCandidateCommand(Guid Id) : IRequest<CandidateResponse?>;

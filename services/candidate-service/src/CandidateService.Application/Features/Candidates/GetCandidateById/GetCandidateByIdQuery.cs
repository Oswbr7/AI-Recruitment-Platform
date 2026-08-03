using CandidateService.Application.Features.Candidates.GetCandidates;
using MediatR;

namespace CandidateService.Application.Features.Candidates.GetCandidateById;

public sealed record GetCandidateByIdQuery(Guid Id) : IRequest<CandidateResponse?>;

using CandidateService.Application.Features.Candidates.GetCandidates;
using MediatR;

namespace CandidateService.Application.Features.Candidates.GetMyProfile;

public sealed record GetMyProfileQuery(Guid UserId)
    : IRequest<CandidateResponse?>;

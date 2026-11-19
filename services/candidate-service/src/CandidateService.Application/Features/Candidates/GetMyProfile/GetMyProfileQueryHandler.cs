using CandidateService.Application.Features.Candidates.Common;
using CandidateService.Application.Features.Candidates.GetCandidates;
using CandidateService.Domain.Repositories;
using MediatR;

namespace CandidateService.Application.Features.Candidates.GetMyProfile;

public sealed class GetMyProfileQueryHandler
    : IRequestHandler<GetMyProfileQuery, CandidateResponse?>
{
    private readonly ICandidateRepository _candidates;

    public GetMyProfileQueryHandler(ICandidateRepository candidates)
    {
        _candidates = candidates;
    }

    public async Task<CandidateResponse?> Handle(
        GetMyProfileQuery request,
        CancellationToken cancellationToken)
    {
        var candidate = await _candidates.GetByUserIdAsync(request.UserId, cancellationToken);

        return candidate?.ToResponse();
    }
}

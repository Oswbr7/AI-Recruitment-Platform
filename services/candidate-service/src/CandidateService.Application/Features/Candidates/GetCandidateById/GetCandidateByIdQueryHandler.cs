using CandidateService.Application.Features.Candidates.Common;
using CandidateService.Application.Features.Candidates.GetCandidates;
using CandidateService.Domain.Repositories;
using MediatR;

namespace CandidateService.Application.Features.Candidates.GetCandidateById;

public sealed class GetCandidateByIdQueryHandler
    : IRequestHandler<GetCandidateByIdQuery, CandidateResponse?>
{
    private readonly ICandidateRepository _candidates;

    public GetCandidateByIdQueryHandler(ICandidateRepository candidates)
    {
        _candidates = candidates;
    }

    public async Task<CandidateResponse?> Handle(
        GetCandidateByIdQuery request,
        CancellationToken cancellationToken)
    {
        var candidate = await _candidates.GetByIdAsync(request.Id, cancellationToken);

        return candidate?.ToResponse();
    }
}

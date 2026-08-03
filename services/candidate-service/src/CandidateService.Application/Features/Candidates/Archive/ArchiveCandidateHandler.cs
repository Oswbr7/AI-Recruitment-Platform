using CandidateService.Application.Features.Candidates.Common;
using CandidateService.Application.Features.Candidates.GetCandidates;
using CandidateService.Domain.Repositories;
using MediatR;

namespace CandidateService.Application.Features.Candidates.Archive;

public sealed class ArchiveCandidateHandler
    : IRequestHandler<ArchiveCandidateCommand, CandidateResponse?>
{
    private readonly ICandidateRepository _candidates;
    private readonly IUnitOfWork _unitOfWork;

    public ArchiveCandidateHandler(
        ICandidateRepository candidates,
        IUnitOfWork unitOfWork)
    {
        _candidates = candidates;
        _unitOfWork = unitOfWork;
    }

    public async Task<CandidateResponse?> Handle(
        ArchiveCandidateCommand request,
        CancellationToken cancellationToken)
    {
        var candidate = await _candidates.GetByIdAsync(request.Id, cancellationToken);

        if (candidate is null)
            return null;

        candidate.Archive();

        await _candidates.UpdateAsync(candidate, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return candidate.ToResponse();
    }
}

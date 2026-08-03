using CandidateService.Application.Features.Candidates.Common;
using CandidateService.Application.Features.Candidates.GetCandidates;
using CandidateService.Domain.Repositories;
using MediatR;

namespace CandidateService.Application.Features.Candidates.Update;

public sealed class UpdateCandidateHandler
    : IRequestHandler<UpdateCandidateCommand, CandidateResponse?>
{
    private readonly ICandidateRepository _candidates;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCandidateHandler(
        ICandidateRepository candidates,
        IUnitOfWork unitOfWork)
    {
        _candidates = candidates;
        _unitOfWork = unitOfWork;
    }

    public async Task<CandidateResponse?> Handle(
        UpdateCandidateCommand request,
        CancellationToken cancellationToken)
    {
        var candidate = await _candidates.GetByIdAsync(request.Id, cancellationToken);

        if (candidate is null)
            return null;

        candidate.UpdateProfile(
            request.FirstName,
            request.LastName,
            request.Email,
            request.Phone,
            request.Location,
            request.Headline,
            request.Summary,
            request.LinkedInUrl,
            request.GithubUrl,
            request.PortfolioUrl,
            request.CurrentCompany,
            request.CurrentPosition,
            request.YearsOfExperience,
            request.ExpectedSalary,
            request.Currency);

        await _candidates.UpdateAsync(candidate, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return candidate.ToResponse();
    }
}

using CandidateService.Domain.Entities;
using CandidateService.Domain.Repositories;
using MediatR;

namespace CandidateService.Application.Features.Candidates.Create;

public sealed class CreateCandidateHandler
    : IRequestHandler<CreateCandidateCommand, CreateCandidateResponse>
{
    private readonly ICandidateRepository _candidates;
    private readonly IUnitOfWork _unitOfWork;

    public CreateCandidateHandler(
        ICandidateRepository candidates,
        IUnitOfWork unitOfWork)
    {
        _candidates = candidates;
        _unitOfWork = unitOfWork;
    }

    public async Task<CreateCandidateResponse> Handle(
        CreateCandidateCommand request,
        CancellationToken cancellationToken)
    {
        var candidate = Candidate.Create(
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

        await _candidates.AddAsync(candidate, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new CreateCandidateResponse(candidate.Id);
    }
}

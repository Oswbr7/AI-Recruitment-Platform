using CandidateService.Application.Features.Candidates.Common;
using CandidateService.Application.Features.Candidates.GetCandidates;
using CandidateService.Domain.Entities;
using CandidateService.Domain.Repositories;
using MediatR;

namespace CandidateService.Application.Features.Candidates.CreateMyProfile;

public sealed class CreateMyProfileHandler
    : IRequestHandler<CreateMyProfileCommand, CandidateResponse?>
{
    private readonly ICandidateRepository _candidates;
    private readonly IUnitOfWork _unitOfWork;

    public CreateMyProfileHandler(
        ICandidateRepository candidates,
        IUnitOfWork unitOfWork)
    {
        _candidates = candidates;
        _unitOfWork = unitOfWork;
    }

    public async Task<CandidateResponse?> Handle(
        CreateMyProfileCommand request,
        CancellationToken cancellationToken)
    {
        // Un perfil por usuario: si ya existe, el endpoint responde 409.
        var existing = await _candidates.GetByUserIdAsync(request.UserId, cancellationToken);

        if (existing != null)
            return null;

        var candidate = Candidate.Create(
            request.FirstName,
            request.LastName,
            request.Email,
            phone: request.Phone,
            location: request.Location,
            headline: request.Headline,
            summary: request.Summary,
            userId: request.UserId);

        await _candidates.AddAsync(candidate, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return candidate.ToResponse();
    }
}

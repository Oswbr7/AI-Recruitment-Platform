using CandidateService.Application.Features.Candidates.GetCandidates;
using MediatR;

namespace CandidateService.Application.Features.Candidates.CreateMyProfile;

public sealed record CreateMyProfileCommand(
    Guid UserId,
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string? Location,
    string? Headline,
    string? Summary
) : IRequest<CandidateResponse?>;

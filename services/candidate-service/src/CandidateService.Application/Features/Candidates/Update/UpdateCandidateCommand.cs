using CandidateService.Application.Features.Candidates.GetCandidates;
using MediatR;

namespace CandidateService.Application.Features.Candidates.Update;

public record UpdateCandidateCommand(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string? Location,
    string? Headline,
    string? Summary,
    string? LinkedInUrl,
    string? GithubUrl,
    string? PortfolioUrl,
    string? CurrentCompany,
    string? CurrentPosition,
    int? YearsOfExperience,
    decimal? ExpectedSalary,
    string? Currency) : IRequest<CandidateResponse?>;

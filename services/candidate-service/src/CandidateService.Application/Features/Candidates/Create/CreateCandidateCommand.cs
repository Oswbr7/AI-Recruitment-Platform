using MediatR;

namespace CandidateService.Application.Features.Candidates.Create;

public record CreateCandidateCommand(
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
    string? Currency) : IRequest<CreateCandidateResponse>;

using CandidateService.Application.Features.Candidates.GetCandidates;
using CandidateService.Domain.Entities;

namespace CandidateService.Application.Features.Candidates.Common;

public static class CandidateResponseExtensions
{
    public static CandidateResponse ToResponse(this Candidate candidate)
    {
        return new CandidateResponse
        {
            Id = candidate.Id,
            FirstName = candidate.FirstName,
            LastName = candidate.LastName,
            Email = candidate.Email,
            Phone = candidate.Phone,
            Location = candidate.Location,
            Headline = candidate.Headline,
            Summary = candidate.Summary,
            LinkedInUrl = candidate.LinkedInUrl,
            GithubUrl = candidate.GithubUrl,
            PortfolioUrl = candidate.PortfolioUrl,
            CurrentCompany = candidate.CurrentCompany,
            CurrentPosition = candidate.CurrentPosition,
            YearsOfExperience = candidate.YearsOfExperience,
            ExpectedSalary = candidate.ExpectedSalary,
            Currency = candidate.Currency,
            Stage = candidate.Stage.ToString(),
            Status = candidate.Status.ToString(),
            CreatedAt = candidate.CreatedAt,
            UpdatedAt = candidate.UpdatedAt
        };
    }
}

using CandidateService.Domain.Entities;

namespace CandidateService.Application.Features.Applications.Common;

public static class ApplicationResponseExtensions
{
    public static ApplicationResponse ToResponse(this JobApplication application)
    {
        return new ApplicationResponse
        {
            Id = application.Id,
            CandidateId = application.CandidateId,
            JobId = application.JobId,
            Status = application.Status.ToString(),
            Source = application.Source?.ToString(),
            CoverNote = application.CoverNote,
            AppliedAt = application.AppliedAt,
            UpdatedAt = application.UpdatedAt
        };
    }
}

using CandidateService.Domain.Entities;

namespace CandidateService.Application.Features.Candidates.Notes.Common;

public static class CandidateNoteResponseExtensions
{
    public static CandidateNoteResponse ToResponse(this CandidateNote note)
    {
        return new CandidateNoteResponse
        {
            Id = note.Id,
            CandidateId = note.CandidateId,
            Content = note.Content,
            CreatedAt = note.CreatedAt,
            UpdatedAt = note.UpdatedAt
        };
    }
}

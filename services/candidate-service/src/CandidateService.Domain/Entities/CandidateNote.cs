namespace CandidateService.Domain.Entities;

public class CandidateNote
{
    public Guid Id { get; private set; }

    public Guid CandidateId { get; private set; }

    public string Content { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public DateTime UpdatedAt { get; private set; }

    private CandidateNote() { }

    private CandidateNote(
        Guid candidateId,
        string content)
    {
        Id = Guid.NewGuid();

        CandidateId = candidateId;

        Content = content;

        CreatedAt = DateTime.UtcNow;

        UpdatedAt = DateTime.UtcNow;
    }

    public static CandidateNote Create(
        Guid candidateId,
        string content)
    {
        return new CandidateNote(candidateId, content);
    }

    public void UpdateContent(string content)
    {
        Content = content;

        UpdatedAt = DateTime.UtcNow;
    }
}

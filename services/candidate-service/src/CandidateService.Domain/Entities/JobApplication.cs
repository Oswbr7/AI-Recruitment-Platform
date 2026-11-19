using CandidateService.Domain.Enums;

namespace CandidateService.Domain.Entities;

/// <summary>
/// Aplicación de un candidato a una vacante: el backbone del dominio ATS.
/// No puede validar que la VACANTE exista (vive en job-service — decisión
/// de consistencia eventual documentada en architecture.md); sí valida la
/// existencia del candidato (misma base de datos, ver SubmitApplicationHandler).
///
/// Se llama JobApplication y no Application para no chocar con el namespace
/// CandidateService.Application.
/// </summary>
public class JobApplication
{
    public Guid Id { get; private set; }

    public Guid CandidateId { get; private set; }

    public Guid JobId { get; private set; }

    public ApplicationStatus Status { get; private set; }

    public ApplicationSource? Source { get; private set; }

    public string? CoverNote { get; private set; }

    public DateTime AppliedAt { get; private set; }

    public DateTime UpdatedAt { get; private set; }

    private JobApplication() { }

    private JobApplication(
        Guid candidateId,
        Guid jobId,
        ApplicationSource? source,
        string? coverNote)
    {
        Id = Guid.NewGuid();
        CandidateId = candidateId;
        JobId = jobId;
        Status = ApplicationStatus.Applied;
        Source = source;
        CoverNote = coverNote;
        AppliedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public static JobApplication Submit(
        Guid candidateId,
        Guid jobId,
        ApplicationSource? source = null,
        string? coverNote = null)
    {
        if (candidateId == Guid.Empty)
            throw new ArgumentException("CandidateId is required.", nameof(candidateId));

        if (jobId == Guid.Empty)
            throw new ArgumentException("JobId is required.", nameof(jobId));

        return new JobApplication(candidateId, jobId, source, coverNote);
    }

    public void StartReview() =>
        ChangeFrom(
            ApplicationStatus.Applied,
            ApplicationStatus.Reviewing,
            "start review");

    public void MoveToInterviewing() =>
        ChangeFrom(
            ApplicationStatus.Reviewing,
            ApplicationStatus.Interviewing,
            "move to interviewing");

    public void Offer()
    {
        EnsureNotTerminal();
        ChangeFrom(
            ApplicationStatus.Interviewing,
            ApplicationStatus.Offered,
            "offer");
    }

    /// <summary>
    /// La empresa rechaza: permitido desde cualquier estado no terminal
    /// (incluida una oferta que el candidato no aceptó).
    /// </summary>
    public void Reject()
    {
        EnsureNotTerminal();
        Status = ApplicationStatus.Rejected;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// El candidato se retira: permitido desde cualquier estado no terminal
    /// (incluida una oferta declinada por el candidato).
    /// </summary>
    public void Withdraw()
    {
        EnsureNotTerminal();
        Status = ApplicationStatus.Withdrawn;
        UpdatedAt = DateTime.UtcNow;
    }

    private void ChangeFrom(
        ApplicationStatus from,
        ApplicationStatus to,
        string action)
    {
        EnsureNotTerminal();

        if (Status != from)
            throw new InvalidOperationException(
                $"Cannot {action} an application in '{Status}' status. Only '{from}' applications can.");

        Status = to;
        UpdatedAt = DateTime.UtcNow;
    }

    private void EnsureNotTerminal()
    {
        if (Status is ApplicationStatus.Rejected or ApplicationStatus.Withdrawn)
            throw new InvalidOperationException(
                $"This application is already '{Status}' and can no longer be modified.");
    }
}

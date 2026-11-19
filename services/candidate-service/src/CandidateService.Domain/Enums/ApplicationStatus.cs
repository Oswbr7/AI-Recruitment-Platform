namespace CandidateService.Domain.Enums;

/// <summary>
/// Pipeline de una aplicación candidato→vacante. Rejected y Withdrawn son
/// terminales (ningún mutador de JobApplication los permite salir).
/// </summary>
public enum ApplicationStatus
{
    Applied = 1,
    Reviewing = 2,
    Interviewing = 3,
    Offered = 4,
    Rejected = 5,
    Withdrawn = 6
}

using CandidateService.Application.Features.Applications.Common;
using CandidateService.Domain.Entities;
using CandidateService.Domain.Repositories;
using MediatR;

namespace CandidateService.Application.Features.Applications.Submit;

public sealed class SubmitApplicationHandler
    : IRequestHandler<SubmitApplicationCommand, ApplicationResponse?>
{
    private readonly ICandidateRepository _candidates;
    private readonly IJobApplicationRepository _applications;
    private readonly IUnitOfWork _unitOfWork;

    public SubmitApplicationHandler(
        ICandidateRepository candidates,
        IJobApplicationRepository applications,
        IUnitOfWork unitOfWork)
    {
        _candidates = candidates;
        _applications = applications;
        _unitOfWork = unitOfWork;
    }

    public async Task<ApplicationResponse?> Handle(
        SubmitApplicationCommand request,
        CancellationToken cancellationToken)
    {
        // El candidato vive en esta misma base de datos: se valida.
        var candidateExists = await _candidates.ExistsAsync(request.CandidateId, cancellationToken);

        if (!candidateExists)
            return null;

        // La vacante vive en job-service: NO se valida aquí (consistencia
        // eventual documentada en architecture.md).
        var alreadyActive = await _applications.ExistsActiveForCandidateAndJobAsync(
            request.CandidateId,
            request.JobId,
            cancellationToken);

        if (alreadyActive)
            throw new InvalidOperationException(
                "An active application already exists for this candidate and job.");

        var application = JobApplication.Submit(
            request.CandidateId,
            request.JobId,
            request.Source,
            request.CoverNote);

        await _applications.AddAsync(application, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return application.ToResponse();
    }
}

using CandidateService.Application.Features.Applications.Common;
using CandidateService.Domain.Repositories;
using MediatR;

namespace CandidateService.Application.Features.Applications.Reject;

public sealed class RejectApplicationHandler
    : IRequestHandler<RejectApplicationCommand, ApplicationResponse?>
{
    private readonly IJobApplicationRepository _applications;
    private readonly IUnitOfWork _unitOfWork;

    public RejectApplicationHandler(
        IJobApplicationRepository applications,
        IUnitOfWork unitOfWork)
    {
        _applications = applications;
        _unitOfWork = unitOfWork;
    }

    public async Task<ApplicationResponse?> Handle(
        RejectApplicationCommand request,
        CancellationToken cancellationToken)
    {
        var application = await _applications.GetByIdAsync(request.Id, cancellationToken);

        if (application is null)
            return null;

        application.Reject();

        await _applications.UpdateAsync(application, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return application.ToResponse();
    }
}

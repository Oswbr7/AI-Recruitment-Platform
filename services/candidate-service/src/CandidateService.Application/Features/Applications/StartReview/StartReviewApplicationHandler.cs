using CandidateService.Application.Features.Applications.Common;
using CandidateService.Domain.Repositories;
using MediatR;

namespace CandidateService.Application.Features.Applications.StartReview;

public sealed class StartReviewApplicationHandler
    : IRequestHandler<StartReviewApplicationCommand, ApplicationResponse?>
{
    private readonly IJobApplicationRepository _applications;
    private readonly IUnitOfWork _unitOfWork;

    public StartReviewApplicationHandler(
        IJobApplicationRepository applications,
        IUnitOfWork unitOfWork)
    {
        _applications = applications;
        _unitOfWork = unitOfWork;
    }

    public async Task<ApplicationResponse?> Handle(
        StartReviewApplicationCommand request,
        CancellationToken cancellationToken)
    {
        var application = await _applications.GetByIdAsync(request.Id, cancellationToken);

        if (application is null)
            return null;

        application.StartReview();

        await _applications.UpdateAsync(application, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return application.ToResponse();
    }
}

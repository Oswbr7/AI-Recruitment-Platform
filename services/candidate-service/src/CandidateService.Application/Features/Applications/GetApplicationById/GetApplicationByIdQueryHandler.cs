using CandidateService.Application.Features.Applications.Common;
using CandidateService.Domain.Repositories;
using MediatR;

namespace CandidateService.Application.Features.Applications.GetApplicationById;

public sealed class GetApplicationByIdQueryHandler
    : IRequestHandler<GetApplicationByIdQuery, ApplicationResponse?>
{
    private readonly IJobApplicationRepository _applications;

    public GetApplicationByIdQueryHandler(IJobApplicationRepository applications)
    {
        _applications = applications;
    }

    public async Task<ApplicationResponse?> Handle(
        GetApplicationByIdQuery request,
        CancellationToken cancellationToken)
    {
        var application = await _applications.GetByIdAsync(request.Id, cancellationToken);

        return application?.ToResponse();
    }
}

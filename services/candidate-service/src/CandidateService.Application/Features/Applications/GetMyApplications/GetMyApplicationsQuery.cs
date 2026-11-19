using BuildingBlocks.Application.Common.Http;
using CandidateService.Application.Features.Applications.Common;
using MediatR;

namespace CandidateService.Application.Features.Applications.GetMyApplications;

public sealed record GetMyApplicationsQuery(
    Guid UserId,
    int Page = 1,
    int PageSize = 10
) : IRequest<PagedResponse<ApplicationResponse>>;

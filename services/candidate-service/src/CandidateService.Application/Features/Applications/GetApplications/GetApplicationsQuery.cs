using BuildingBlocks.Application.Common.Http;
using CandidateService.Application.Features.Applications.Common;
using CandidateService.Domain.Enums;
using MediatR;

namespace CandidateService.Application.Features.Applications.GetApplications;

public sealed record GetApplicationsQuery(
    int Page = 1,
    int PageSize = 10,
    Guid? CandidateId = null,
    Guid? JobId = null,
    ApplicationStatus? Status = null,
    string? SortBy = null,
    string? SortDirection = null
) : IRequest<PagedResponse<ApplicationResponse>>;

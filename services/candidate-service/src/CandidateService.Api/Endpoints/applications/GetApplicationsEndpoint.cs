using CandidateService.Application.Features.Applications.Common;
using CandidateService.Application.Features.Applications.GetApplications;
using CandidateService.Domain.Enums;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CandidateService.Api.Endpoints.Applications;

public sealed class GetApplicationsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/applications", Handle)
            .WithName("GetApplications")
            .WithTags("Applications")
            // Filtros libres por candidato/vacante = vista de gestión.
            // Los Candidates usan GET /api/applications/mine (solo lo suyo).
            .RequireAuthorization(policy =>
                policy.RequireRole("Admin", "Recruiter"));
    }

    private static async Task<IResult> Handle(
        ISender sender,
        CancellationToken cancellationToken,
        int page = 1,
        int pageSize = 10,
        Guid? candidateId = null,
        Guid? jobId = null,
        ApplicationStatus? status = null,
        string? sortBy = null,
        string? sortDirection = null)
    {
        var response = await sender.Send(
            new GetApplicationsQuery(page, pageSize, candidateId, jobId, status, sortBy, sortDirection),
            cancellationToken);

        return Results.Ok(Result<PagedResponse<ApplicationResponse>>.Ok(response));
    }
}

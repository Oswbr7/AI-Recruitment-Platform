using JobService.Application.Features.Jobs.GetJobs;
using JobService.Domain.Enums;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace JobService.Api.Endpoints.Jobs;

public sealed class GetJobsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/jobs", Handle)
            .WithName("GetJobs")
            .WithTags("Jobs")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        ISender sender,
        CancellationToken cancellationToken,
        int page = 1,
        int pageSize = 10,
        string? search = null,
        JobStatus? status = null,
        Guid? companyId = null,
        string? sortBy = null,
        string? sortDirection = null)
    {
        var response = await sender.Send(
            new GetJobsQuery(page, pageSize, search, status, companyId, sortBy, sortDirection),
            cancellationToken);

        return Results.Ok(
            Result<PagedResponse<JobResponse>>.Ok(response));
    }
}

using CandidateService.Application.Features.Applications.Common;
using CandidateService.Application.Features.Applications.Submit;
using CandidateService.Domain.Enums;
using MediatR;

namespace CandidateService.Api.Endpoints.Applications;

public sealed class SubmitApplicationEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/applications", Handle)
            .WithName("SubmitApplication")
            .WithTags("Applications")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        SubmitApplicationRequest request,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new SubmitApplicationCommand(
                request.CandidateId,
                request.JobId,
                request.Source,
                request.CoverNote),
            cancellationToken);

        if (response is null)
            return Results.NotFound(BuildingBlocks.Application.Common.Http.Result.Failure("Candidate not found."));

        return Results.Created(
            $"/api/applications/{response.Id}",
            BuildingBlocks.Application.Common.Http.Result<ApplicationResponse>.Ok(response, "Application submitted."));
    }
}

public sealed record SubmitApplicationRequest(
    Guid CandidateId,
    Guid JobId,
    ApplicationSource? Source,
    string? CoverNote);

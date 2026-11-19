using CandidateService.Application.Features.Applications.Common;
using CandidateService.Application.Features.Applications.ToInterviewing;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CandidateService.Api.Endpoints.Applications;

public sealed class ToInterviewingApplicationEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/applications/{id:guid}/to-interviewing", Handle)
            .WithName("ToInterviewingApplication")
            .WithTags("Applications")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new ToInterviewingApplicationCommand(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Application not found."));

        return Results.Ok(Result<ApplicationResponse>.Ok(response));
    }
}

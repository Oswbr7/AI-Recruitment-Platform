using CandidateService.Application.Features.Applications.Common;
using CandidateService.Application.Features.Applications.GetApplicationById;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CandidateService.Api.Endpoints.Applications;

public sealed class GetApplicationByIdEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/applications/{id:guid}", Handle)
            .WithName("GetApplicationById")
            .WithTags("Applications")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new GetApplicationByIdQuery(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Application not found."));

        return Results.Ok(Result<ApplicationResponse>.Ok(response));
    }
}

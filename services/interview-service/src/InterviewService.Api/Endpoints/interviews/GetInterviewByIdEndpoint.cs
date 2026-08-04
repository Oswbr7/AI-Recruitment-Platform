using InterviewService.Application.Features.Interviews.GetInterviewById;
using InterviewService.Application.Features.Interviews.GetInterviews;
using InterviewService.Shared.Common;
using MediatR;

namespace InterviewService.Api.Endpoints.Interviews;

public sealed class GetInterviewByIdEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/interviews/{id:guid}", Handle)
            .WithName("GetInterviewById")
            .WithTags("Interviews")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new GetInterviewByIdQuery(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Interview not found."));

        return Results.Ok(Result<InterviewResponse>.Ok(response));
    }
}

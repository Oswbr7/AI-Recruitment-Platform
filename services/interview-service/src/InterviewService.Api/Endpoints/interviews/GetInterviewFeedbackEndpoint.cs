using InterviewService.Application.Features.Interviews.Feedback.Common;
using InterviewService.Application.Features.Interviews.Feedback.GetFeedback;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace InterviewService.Api.Endpoints.Interviews;

public sealed class GetInterviewFeedbackEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/interviews/{id:guid}/feedback", Handle)
            .WithName("GetInterviewFeedback")
            .WithTags("Interviews")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new GetInterviewFeedbackQuery(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Interview not found."));

        return Results.Ok(Result<List<InterviewFeedbackResponse>>.Ok(response));
    }
}

using InterviewService.Application.Features.Interviews.GetInterviews;
using InterviewService.Application.Features.Interviews.Update;
using InterviewService.Domain.Enums;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace InterviewService.Api.Endpoints.Interviews;

public sealed class UpdateInterviewEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/api/interviews/{id:guid}", Handle)
            .WithName("UpdateInterview")
            .WithTags("Interviews")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        UpdateInterviewRequestBody body,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var command = new UpdateInterviewCommand(
            id,
            body.Title,
            body.Description,
            body.InterviewType,
            body.InterviewStage,
            body.DurationMinutes,
            body.MeetingUrl,
            body.Location);

        var response = await sender.Send(command, cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Interview not found."));

        return Results.Ok(Result<InterviewResponse>.Ok(response, "Interview updated successfully."));
    }
}

public sealed record UpdateInterviewRequestBody(
    string Title,
    string? Description,
    InterviewType InterviewType,
    InterviewStage InterviewStage,
    int DurationMinutes,
    string? MeetingUrl,
    string? Location);

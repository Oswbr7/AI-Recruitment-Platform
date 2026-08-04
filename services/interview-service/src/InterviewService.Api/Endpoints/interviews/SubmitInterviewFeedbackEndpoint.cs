using InterviewService.Application.Features.Interviews.Feedback.Common;
using InterviewService.Application.Features.Interviews.Feedback.SubmitFeedback;
using InterviewService.Domain.Enums;
using InterviewService.Shared.Common;
using MediatR;

namespace InterviewService.Api.Endpoints.Interviews;

public sealed class SubmitInterviewFeedbackEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/interviews/{id:guid}/feedback", Handle)
            .WithName("SubmitInterviewFeedback")
            .WithTags("Interviews")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        SubmitInterviewFeedbackRequestBody body,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var command = new SubmitInterviewFeedbackCommand(
            id,
            body.ReviewerId,
            body.TechnicalScore,
            body.CommunicationScore,
            body.ProblemSolvingScore,
            body.CultureFitScore,
            body.Comments,
            body.Recommendation);

        var response = await sender.Send(command, cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Interview not found."));

        return Results.Created(
            $"/api/interviews/{id}/feedback/{response.Id}",
            Result<InterviewFeedbackResponse>.Ok(response, "Feedback submitted successfully."));
    }
}

public sealed record SubmitInterviewFeedbackRequestBody(
    Guid ReviewerId,
    int TechnicalScore,
    int CommunicationScore,
    int ProblemSolvingScore,
    int CultureFitScore,
    string? Comments,
    Recommendation Recommendation);

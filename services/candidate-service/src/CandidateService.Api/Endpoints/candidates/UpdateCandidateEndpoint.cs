using CandidateService.Application.Features.Candidates.GetCandidates;
using CandidateService.Application.Features.Candidates.Update;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CandidateService.Api.Endpoints.Candidates;

public sealed class UpdateCandidateEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/api/candidates/{id:guid}", Handle)
            .WithName("UpdateCandidate")
            .WithTags("Candidates")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        UpdateCandidateRequestBody body,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var command = new UpdateCandidateCommand(
            id,
            body.FirstName,
            body.LastName,
            body.Email,
            body.Phone,
            body.Location,
            body.Headline,
            body.Summary,
            body.LinkedInUrl,
            body.GithubUrl,
            body.PortfolioUrl,
            body.CurrentCompany,
            body.CurrentPosition,
            body.YearsOfExperience,
            body.ExpectedSalary,
            body.Currency);

        var response = await sender.Send(command, cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Candidate not found."));

        return Results.Ok(Result<CandidateResponse>.Ok(response, "Candidate updated successfully."));
    }
}

public sealed record UpdateCandidateRequestBody(
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string? Location,
    string? Headline,
    string? Summary,
    string? LinkedInUrl,
    string? GithubUrl,
    string? PortfolioUrl,
    string? CurrentCompany,
    string? CurrentPosition,
    int? YearsOfExperience,
    decimal? ExpectedSalary,
    string? Currency);

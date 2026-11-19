using System.Security.Claims;
using BuildingBlocks.Application.Common.Http;
using CandidateService.Application.Features.Candidates.CreateMyProfile;
using CandidateService.Application.Features.Candidates.GetCandidates;
using MediatR;

namespace CandidateService.Api.Endpoints.Candidates;

/// <summary>
/// Crea el perfil candidato del usuario autenticado, vinculado al claim sub
/// del JWT. Un perfil por usuario (409 si ya existe). Flujo "mis
/// aplicaciones": sin perfil no hay Apply ni /mine.
/// </summary>
public sealed class CreateMyProfileEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/candidates/me", Handle)
            .WithName("CreateMyProfile")
            .WithTags("Candidates")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        CreateMyProfileRequest request,
        ClaimsPrincipal principal,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(
            principal.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? principal.FindFirstValue("sub")
                ?? throw new InvalidOperationException("El JWT no contiene el claim 'sub'."));

        var response = await sender.Send(
            new CreateMyProfileCommand(
                userId,
                request.FirstName,
                request.LastName,
                request.Email,
                request.Phone,
                request.Location,
                request.Headline,
                request.Summary),
            cancellationToken);

        if (response is null)
            return Results.Conflict(Result.Failure("This user already has a candidate profile."));

        return Results.Created(
            $"/api/candidates/{response.Id}",
            Result<CandidateResponse>.Ok(response, "Candidate profile created."));
    }
}

public sealed record CreateMyProfileRequest(
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string? Location,
    string? Headline,
    string? Summary);

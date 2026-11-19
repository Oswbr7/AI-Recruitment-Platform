using System.Security.Claims;
using BuildingBlocks.Application.Common.Http;
using CandidateService.Application.Features.Candidates.GetCandidates;
using CandidateService.Application.Features.Candidates.GetMyProfile;
using MediatR;

namespace CandidateService.Api.Endpoints.Candidates;

/// <summary>
/// "Mi perfil" de candidato, resuelto desde el JWT (claim sub) — nunca de
/// parámetros. 404 si el usuario autenticado no tiene perfil candidato.
/// </summary>
public sealed class GetMyProfileEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/candidates/me", Handle)
            .WithName("GetMyProfile")
            .WithTags("Candidates")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        ClaimsPrincipal principal,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(
            principal.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? principal.FindFirstValue("sub")
                ?? throw new InvalidOperationException("El JWT no contiene el claim 'sub'."));

        var response = await sender.Send(
            new GetMyProfileQuery(userId),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Candidate profile not found. Create it with POST /api/candidates/me."));

        return Results.Ok(Result<CandidateResponse>.Ok(response));
    }
}

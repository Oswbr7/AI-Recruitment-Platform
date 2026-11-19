using System.Security.Claims;
using BuildingBlocks.Application.Common.Http;
using CandidateService.Application.Features.Applications.Common;
using CandidateService.Application.Features.Applications.GetMyApplications;
using MediatR;

namespace CandidateService.Api.Endpoints.Applications;

/// <summary>
/// "Mis aplicaciones": resuelve sub -> candidato -> aplicaciones internamente.
/// El candidateId NUNCA viaja por URL — sin esto, cualquier autenticado
/// podría enumerar las aplicaciones de cualquier candidato.
/// </summary>
public sealed class GetMyApplicationsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        // Registrada ANTES de /api/applications/{id:guid}: las rutas
        // literales tienen prioridad sobre el constraint guid.
        app.MapGet("/api/applications/mine", Handle)
            .WithName("GetMyApplications")
            .WithTags("Applications")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        ClaimsPrincipal principal,
        ISender sender,
        CancellationToken cancellationToken,
        int page = 1,
        int pageSize = 10)
    {
        var userId = Guid.Parse(
            principal.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? principal.FindFirstValue("sub")
                ?? throw new InvalidOperationException("El JWT no contiene el claim 'sub'."));

        var response = await sender.Send(
            new GetMyApplicationsQuery(userId, page, pageSize),
            cancellationToken);

        return Results.Ok(Result<PagedResponse<ApplicationResponse>>.Ok(response));
    }
}

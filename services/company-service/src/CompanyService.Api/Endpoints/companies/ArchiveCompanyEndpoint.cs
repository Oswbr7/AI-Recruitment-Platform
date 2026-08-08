using CompanyService.Application.Features.Companies.Archive;
using CompanyService.Application.Features.Companies.GetCompanies;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CompanyService.Api.Endpoints.Companies;

public sealed class ArchiveCompanyEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/companies/{id:guid}/archive", Handle)
            .WithName("ArchiveCompany")
            .WithTags("Companies")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new ArchiveCompanyCommand(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Company not found."));

        return Results.Ok(Result<CompanyResponse>.Ok(response, "Company archived successfully."));
    }
}

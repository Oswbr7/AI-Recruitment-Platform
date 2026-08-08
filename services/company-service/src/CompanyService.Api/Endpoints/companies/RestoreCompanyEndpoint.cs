using CompanyService.Application.Features.Companies.GetCompanies;
using CompanyService.Application.Features.Companies.Restore;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CompanyService.Api.Endpoints.Companies;

public sealed class RestoreCompanyEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/companies/{id:guid}/restore", Handle)
            .WithName("RestoreCompany")
            .WithTags("Companies")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new RestoreCompanyCommand(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Company not found."));

        return Results.Ok(Result<CompanyResponse>.Ok(response, "Company restored successfully."));
    }
}

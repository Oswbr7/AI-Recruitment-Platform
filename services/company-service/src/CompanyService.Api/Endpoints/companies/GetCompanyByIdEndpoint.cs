using CompanyService.Application.Features.Companies.GetCompanies;
using CompanyService.Application.Features.Companies.GetCompanyById;
using CompanyService.Shared.Common;
using MediatR;

namespace CompanyService.Api.Endpoints.Companies;

public sealed class GetCompanyByIdEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/companies/{id:guid}", Handle)
            .WithName("GetCompanyById")
            .WithTags("Companies")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new GetCompanyByIdQuery(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Company not found."));

        return Results.Ok(Result<CompanyResponse>.Ok(response));
    }
}

using CompanyService.Application.Features.Companies.Contacts.Common;
using CompanyService.Application.Features.Companies.Contacts.GetContacts;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CompanyService.Api.Endpoints.Companies;

public sealed class GetCompanyContactsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/companies/{id:guid}/contacts", Handle)
            .WithName("GetCompanyContacts")
            .WithTags("Companies")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new GetCompanyContactsQuery(id),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Company not found."));

        return Results.Ok(Result<List<CompanyContactResponse>>.Ok(response));
    }
}

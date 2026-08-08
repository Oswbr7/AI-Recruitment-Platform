using CompanyService.Application.Features.Companies.Contacts.DeleteContact;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CompanyService.Api.Endpoints.Companies;

public sealed class DeleteCompanyContactEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/api/companies/{id:guid}/contacts/{contactId:guid}", Handle)
            .WithName("DeleteCompanyContact")
            .WithTags("Companies")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        Guid contactId,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var deleted = await sender.Send(
            new DeleteCompanyContactCommand(contactId),
            cancellationToken);

        if (!deleted)
            return Results.NotFound(Result.Failure("Contact not found."));

        return Results.NoContent();
    }
}

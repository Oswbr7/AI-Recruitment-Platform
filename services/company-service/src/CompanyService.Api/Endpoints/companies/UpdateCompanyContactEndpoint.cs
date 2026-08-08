using CompanyService.Application.Features.Companies.Contacts.Common;
using CompanyService.Application.Features.Companies.Contacts.UpdateContact;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CompanyService.Api.Endpoints.Companies;

public sealed class UpdateCompanyContactEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/api/companies/{id:guid}/contacts/{contactId:guid}", Handle)
            .WithName("UpdateCompanyContact")
            .WithTags("Companies")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        Guid contactId,
        UpdateCompanyContactRequestBody body,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var command = new UpdateCompanyContactCommand(
            contactId,
            body.FirstName,
            body.LastName,
            body.Email,
            body.Phone,
            body.Position,
            body.IsPrimaryContact);

        var response = await sender.Send(command, cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Contact not found."));

        return Results.Ok(Result<CompanyContactResponse>.Ok(response, "Contact updated successfully."));
    }
}

public sealed record UpdateCompanyContactRequestBody(
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string? Position,
    bool IsPrimaryContact);

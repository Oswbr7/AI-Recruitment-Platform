using CompanyService.Application.Features.Companies.Contacts.AddContact;
using CompanyService.Application.Features.Companies.Contacts.Common;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CompanyService.Api.Endpoints.Companies;

public sealed class AddCompanyContactEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/companies/{id:guid}/contacts", Handle)
            .WithName("AddCompanyContact")
            .WithTags("Companies")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        AddCompanyContactRequestBody body,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var command = new AddCompanyContactCommand(
            id,
            body.FirstName,
            body.LastName,
            body.Email,
            body.Phone,
            body.Position,
            body.IsPrimaryContact);

        var response = await sender.Send(command, cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Company not found."));

        return Results.Created(
            $"/api/companies/{id}/contacts/{response.Id}",
            Result<CompanyContactResponse>.Ok(response, "Contact added successfully."));
    }
}

public sealed record AddCompanyContactRequestBody(
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string? Position,
    bool IsPrimaryContact);

using CompanyService.Application.Features.Companies.GetCompanies;
using CompanyService.Application.Features.Companies.Update;
using CompanyService.Domain.Enums;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CompanyService.Api.Endpoints.Companies;

public sealed class UpdateCompanyEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/api/companies/{id:guid}", Handle)
            .WithName("UpdateCompany")
            .WithTags("Companies")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        UpdateCompanyRequestBody body,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var command = new UpdateCompanyCommand(
            id,
            body.Name,
            body.Industry,
            body.LegalName,
            body.TaxId,
            body.Website,
            body.Email,
            body.Phone,
            body.Description,
            body.CompanySize,
            body.FoundedYear,
            body.Country,
            body.State,
            body.City,
            body.Address,
            body.PostalCode);

        var response = await sender.Send(command, cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Company not found."));

        return Results.Ok(Result<CompanyResponse>.Ok(response, "Company updated successfully."));
    }
}

public sealed record UpdateCompanyRequestBody(
    string Name,
    Industry Industry,
    string? LegalName,
    string? TaxId,
    string? Website,
    string? Email,
    string? Phone,
    string? Description,
    CompanySize? CompanySize,
    int? FoundedYear,
    string? Country,
    string? State,
    string? City,
    string? Address,
    string? PostalCode);

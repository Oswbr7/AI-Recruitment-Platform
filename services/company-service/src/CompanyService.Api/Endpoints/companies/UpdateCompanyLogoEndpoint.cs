using CompanyService.Application.Features.Companies.GetCompanies;
using CompanyService.Application.Features.Companies.UpdateLogo;
using CompanyService.Shared.Common;
using MediatR;

namespace CompanyService.Api.Endpoints.Companies;

public sealed class UpdateCompanyLogoEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("/api/companies/{id:guid}/logo", Handle)
            .WithName("UpdateCompanyLogo")
            .WithTags("Companies")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        UpdateCompanyLogoRequestBody body,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(
            new UpdateCompanyLogoCommand(id, body.LogoUrl),
            cancellationToken);

        if (response is null)
            return Results.NotFound(Result.Failure("Company not found."));

        return Results.Ok(Result<CompanyResponse>.Ok(response, "Logo updated successfully."));
    }
}

public sealed record UpdateCompanyLogoRequestBody(string? LogoUrl);

using CompanyService.Application.Features.Companies.Create;
using BuildingBlocks.Application.Common.Http;
using MediatR;

namespace CompanyService.Api.Endpoints.Companies;

public sealed class CreateCompanyEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/companies", Handle)
            .WithName("CreateCompany")
            .WithTags("Companies")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        CreateCompanyCommand command,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var response = await sender.Send(command, cancellationToken);

        return Results.Created(
            $"/api/companies/{response.Id}",
            Result<CreateCompanyResponse>.Ok(response, "Company created successfully."));
    }
}

using CompanyService.Application.Features.Companies.Delete;
using CompanyService.Shared.Common;
using MediatR;

namespace CompanyService.Api.Endpoints.Companies;

public sealed class DeleteCompanyEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/api/companies/{id:guid}", Handle)
            .WithName("DeleteCompany")
            .WithTags("Companies")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        Guid id,
        ISender sender,
        CancellationToken cancellationToken)
    {
        var deleted = await sender.Send(
            new DeleteCompanyCommand(id),
            cancellationToken);

        if (!deleted)
            return Results.NotFound(Result.Failure("Company not found."));

        return Results.NoContent();
    }
}

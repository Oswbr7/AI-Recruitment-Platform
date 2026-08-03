using CompanyService.Application.Features.Companies.GetCompanies;
using CompanyService.Domain.Enums;
using CompanyService.Shared.Common;
using MediatR;

namespace CompanyService.Api.Endpoints.Companies;

public sealed class GetCompaniesEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/companies", Handle)
            .WithName("GetCompanies")
            .WithTags("Companies")
            .RequireAuthorization();
    }

    private static async Task<IResult> Handle(
        ISender sender,
        CancellationToken cancellationToken,
        int page = 1,
        int pageSize = 10,
        string? search = null,
        string? industry = null,
        string? status = null,
        string? country = null,
        string? sortBy = null,
        string? sortDirection = null)
    {
        Enum.TryParse<Industry>(industry, true, out var parsedIndustry);
        Enum.TryParse<CompanyStatus>(status, true, out var parsedStatus);

        var query = new GetCompaniesQuery(
            page < 1 ? 1 : page,
            pageSize < 1 ? 10 : pageSize,
            search,
            string.IsNullOrWhiteSpace(industry) ? null : parsedIndustry,
            string.IsNullOrWhiteSpace(status) ? null : parsedStatus,
            country,
            sortBy,
            sortDirection);

        var response = await sender.Send(query, cancellationToken);

        return Results.Ok(Result<PagedResponse<CompanyResponse>>.Ok(response));
    }
}

using MediatR;

namespace CompanyService.Application.Features.Companies.Delete;

public sealed record DeleteCompanyCommand(Guid Id) : IRequest<bool>;

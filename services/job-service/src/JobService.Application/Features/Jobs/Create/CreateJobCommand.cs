using BuildingBlocks.Application.Common.Errors;
using MediatR;

namespace JobService.Application.Features.Jobs.Create;

public record CreateJobCommand(
    string Title,
    string Department,
    string Location,
    string Description) : IRequest<Result<Guid>>;

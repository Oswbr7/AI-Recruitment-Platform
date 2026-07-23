using MediatR;

namespace JobService.Application.Jobs.Commands.CreateJob;

public sealed record CreateJobCommand(
    string Title,
    string Department,
    string Location,
    string Description
) : IRequest<Guid>;
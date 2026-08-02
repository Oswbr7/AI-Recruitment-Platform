using JobService.Application.Features.Jobs.Create;
using MediatR;

namespace JobService.Application.Features.Jobs.Duplicate;

public sealed record DuplicateJobCommand(Guid Id) : IRequest<CreateJobResponse?>;

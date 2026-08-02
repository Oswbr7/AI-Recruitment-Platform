using JobService.Application.Jobs.Queries.GetJobs;
using MediatR;

namespace JobService.Application.Features.Jobs.Publish;

public sealed record PublishJobCommand(Guid Id) : IRequest<JobResponse?>;

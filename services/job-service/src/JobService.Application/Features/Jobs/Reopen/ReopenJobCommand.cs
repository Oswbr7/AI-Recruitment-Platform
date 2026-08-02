using JobService.Application.Jobs.Queries.GetJobs;
using MediatR;

namespace JobService.Application.Features.Jobs.Reopen;

public sealed record ReopenJobCommand(Guid Id) : IRequest<JobResponse?>;

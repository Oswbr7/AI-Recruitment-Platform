using JobService.Application.Features.Jobs.GetJobs;
using MediatR;

namespace JobService.Application.Features.Jobs.Reopen;

public sealed record ReopenJobCommand(Guid Id) : IRequest<JobResponse?>;

using JobService.Application.Features.Jobs.GetJobs;
using MediatR;

namespace JobService.Application.Features.Jobs.GetJobById;

public sealed record GetJobByIdQuery(Guid Id) : IRequest<JobResponse?>;

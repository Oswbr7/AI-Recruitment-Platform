using InterviewService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace InterviewService.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Interview> Interviews => Set<Interview>();

    public DbSet<InterviewFeedback> InterviewFeedbacks => Set<InterviewFeedback>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(ApplicationDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }
}

using CandidateService.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CandidateService.Infrastructure.Persistence.Configurations;

public class JobApplicationConfiguration : IEntityTypeConfiguration<JobApplication>
{
    public void Configure(EntityTypeBuilder<JobApplication> builder)
    {
        builder.ToTable("JobApplications");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.CandidateId)
            .IsRequired();

        builder.Property(x => x.JobId)
            .IsRequired();

        builder.Property(x => x.Status)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(x => x.Source)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(x => x.CoverNote)
            .HasColumnType("text");

        builder.Property(x => x.AppliedAt);

        builder.Property(x => x.UpdatedAt);

        // Las consultas de applicants por vacante y por candidato son las
        // rutas calientes del ATS.
        builder.HasIndex(x => x.JobId);

        builder.HasIndex(x => x.CandidateId);
    }
}

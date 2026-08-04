using InterviewService.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InterviewService.Infrastructure.Persistence.Configurations;

public class InterviewConfiguration : IEntityTypeConfiguration<Interview>
{
    public void Configure(EntityTypeBuilder<Interview> builder)
    {
        builder.ToTable("Interviews");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.CandidateId)
            .IsRequired();

        builder.Property(x => x.JobId)
            .IsRequired();

        builder.Property(x => x.RecruiterId)
            .IsRequired();

        builder.Property(x => x.Title)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.Description)
            .HasColumnType("text");

        builder.Property(x => x.InterviewType)
            .HasConversion<int>();

        builder.Property(x => x.InterviewStage)
            .HasConversion<int>();

        builder.Property(x => x.ScheduledAt)
            .IsRequired();

        builder.Property(x => x.DurationMinutes);

        builder.Property(x => x.MeetingUrl)
            .HasMaxLength(300);

        builder.Property(x => x.Location)
            .HasMaxLength(300);

        builder.Property(x => x.Status)
            .HasConversion<int>();

        builder.Property(x => x.FeedbackSubmitted);

        builder.Property(x => x.OverallScore)
            .HasColumnType("decimal(4,2)");

        builder.Property(x => x.CreatedAt);

        builder.Property(x => x.UpdatedAt);

        builder.HasIndex(x => x.CandidateId);

        builder.HasIndex(x => x.JobId);

        builder.HasIndex(x => x.RecruiterId);

        builder.HasIndex(x => x.Status);

        builder.HasIndex(x => x.ScheduledAt);
    }
}

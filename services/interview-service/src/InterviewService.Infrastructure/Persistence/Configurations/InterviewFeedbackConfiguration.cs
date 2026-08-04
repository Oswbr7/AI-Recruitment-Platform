using InterviewService.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InterviewService.Infrastructure.Persistence.Configurations;

public class InterviewFeedbackConfiguration : IEntityTypeConfiguration<InterviewFeedback>
{
    public void Configure(EntityTypeBuilder<InterviewFeedback> builder)
    {
        builder.ToTable("InterviewFeedbacks");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.InterviewId)
            .IsRequired();

        builder.Property(x => x.ReviewerId)
            .IsRequired();

        builder.Property(x => x.TechnicalScore);

        builder.Property(x => x.CommunicationScore);

        builder.Property(x => x.ProblemSolvingScore);

        builder.Property(x => x.CultureFitScore);

        builder.Property(x => x.Comments)
            .HasColumnType("text");

        builder.Property(x => x.Recommendation)
            .HasConversion<int>();

        builder.Property(x => x.CreatedAt);

        builder.HasIndex(x => x.InterviewId);
    }
}

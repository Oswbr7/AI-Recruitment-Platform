using CandidateService.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CandidateService.Infrastructure.Persistence.Configurations;

public class CandidateConfiguration : IEntityTypeConfiguration<Candidate>
{
    public void Configure(EntityTypeBuilder<Candidate> builder)
    {
        builder.ToTable("Candidates");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.FirstName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.LastName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.Email)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.Phone)
            .HasMaxLength(30);

        builder.Property(x => x.Location)
            .HasMaxLength(150);

        builder.Property(x => x.Headline)
            .HasMaxLength(200);

        builder.Property(x => x.Summary)
            .HasColumnType("text");

        builder.Property(x => x.LinkedInUrl)
            .HasMaxLength(300);

        builder.Property(x => x.GithubUrl)
            .HasMaxLength(300);

        builder.Property(x => x.PortfolioUrl)
            .HasMaxLength(300);

        builder.Property(x => x.CurrentCompany)
            .HasMaxLength(150);

        builder.Property(x => x.CurrentPosition)
            .HasMaxLength(150);

        builder.Property(x => x.YearsOfExperience);

        builder.Property(x => x.ExpectedSalary)
            .HasColumnType("decimal(18,2)");

        builder.Property(x => x.Currency)
            .HasMaxLength(3);

        builder.Property(x => x.Stage)
            .HasConversion<int>();

        builder.Property(x => x.Status)
            .HasConversion<int>();

        builder.Property(x => x.CreatedAt);

        builder.Property(x => x.UpdatedAt);

        builder.HasIndex(x => x.Email);
    }
}

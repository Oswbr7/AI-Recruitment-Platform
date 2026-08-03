using CompanyService.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CompanyService.Infrastructure.Persistence.Configurations;

public class CompanyConfiguration : IEntityTypeConfiguration<Company>
{
    public void Configure(EntityTypeBuilder<Company> builder)
    {
        builder.ToTable("Companies");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.LegalName)
            .HasMaxLength(200);

        builder.Property(x => x.TaxId)
            .HasMaxLength(50);

        builder.Property(x => x.Industry)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(x => x.Website)
            .HasMaxLength(300);

        builder.Property(x => x.Email)
            .HasMaxLength(200);

        builder.Property(x => x.Phone)
            .HasMaxLength(30);

        builder.Property(x => x.Description)
            .HasColumnType("text");

        builder.Property(x => x.LogoUrl)
            .HasMaxLength(300);

        builder.Property(x => x.CompanySize)
            .HasConversion<int?>();

        builder.Property(x => x.FoundedYear);

        builder.Property(x => x.Country)
            .HasMaxLength(100);

        builder.Property(x => x.State)
            .HasMaxLength(100);

        builder.Property(x => x.City)
            .HasMaxLength(100);

        builder.Property(x => x.Address)
            .HasMaxLength(300);

        builder.Property(x => x.PostalCode)
            .HasMaxLength(20);

        builder.Property(x => x.Status)
            .HasConversion<int>();

        builder.Property(x => x.CreatedAt);

        builder.Property(x => x.UpdatedAt);

        builder.HasIndex(x => x.Name);

        builder.HasIndex(x => x.Industry);

        builder.HasIndex(x => x.Country);

        builder.HasIndex(x => x.TaxId)
            .IsUnique();
    }
}

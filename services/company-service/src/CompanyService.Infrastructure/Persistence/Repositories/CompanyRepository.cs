using CompanyService.Domain.Entities;
using CompanyService.Domain.Enums;
using CompanyService.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CompanyService.Infrastructure.Persistence.Repositories;

public class CompanyRepository : ICompanyRepository
{
    private readonly ApplicationDbContext _context;

    public CompanyRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Company company, CancellationToken cancellationToken)
    {
        await _context.Companies.AddAsync(company, cancellationToken);
    }

    public async Task<Company?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.Companies
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<(List<Company> Items, int TotalCount)> GetPagedAsync(
        int page,
        int pageSize,
        string? search,
        Industry? industry,
        CompanyStatus? status,
        string? country,
        string? sortBy,
        string? sortDirection,
        CancellationToken cancellationToken)
    {
        var query = _context.Companies
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();

            query = query.Where(x =>
                x.Name.ToLower().Contains(term) ||
                (x.LegalName != null && x.LegalName.ToLower().Contains(term)) ||
                (x.Email != null && x.Email.ToLower().Contains(term)));
        }

        if (industry.HasValue)
            query = query.Where(x => x.Industry == industry.Value);

        if (status.HasValue)
            query = query.Where(x => x.Status == status.Value);

        if (!string.IsNullOrWhiteSpace(country))
            query = query.Where(x => x.Country == country);

        var totalCount = await query.CountAsync(cancellationToken);

        var descending = string.Equals(
            sortDirection,
            "desc",
            StringComparison.OrdinalIgnoreCase);

        query = sortBy?.ToLowerInvariant() switch
        {
            "name" => descending
                ? query.OrderByDescending(x => x.Name)
                : query.OrderBy(x => x.Name),

            "industry" => descending
                ? query.OrderByDescending(x => x.Industry)
                : query.OrderBy(x => x.Industry),

            "country" => descending
                ? query.OrderByDescending(x => x.Country)
                : query.OrderBy(x => x.Country),

            "updatedat" => descending
                ? query.OrderByDescending(x => x.UpdatedAt)
                : query.OrderBy(x => x.UpdatedAt),

            _ => descending
                ? query.OrderByDescending(x => x.CreatedAt)
                : query.OrderBy(x => x.CreatedAt),
        };

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public Task UpdateAsync(Company company, CancellationToken cancellationToken)
    {
        _context.Companies.Update(company);

        return Task.CompletedTask;
    }

    public Task DeleteAsync(Company company, CancellationToken cancellationToken)
    {
        _context.Companies.Remove(company);

        return Task.CompletedTask;
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.Companies
            .AnyAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<bool> ExistsByTaxIdAsync(string taxId, Guid? excludeCompanyId, CancellationToken cancellationToken)
    {
        return await _context.Companies
            .AnyAsync(x =>
                x.TaxId == taxId &&
                (!excludeCompanyId.HasValue || x.Id != excludeCompanyId.Value),
                cancellationToken);
    }
}

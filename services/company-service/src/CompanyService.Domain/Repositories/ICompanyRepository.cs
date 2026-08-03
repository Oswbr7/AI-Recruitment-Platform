using CompanyService.Domain.Entities;
using CompanyService.Domain.Enums;

namespace CompanyService.Domain.Repositories;

public interface ICompanyRepository
{
    Task AddAsync(Company company, CancellationToken cancellationToken);

    Task<Company?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<(List<Company> Items, int TotalCount)> GetPagedAsync(
        int page,
        int pageSize,
        string? search,
        Industry? industry,
        CompanyStatus? status,
        string? country,
        string? sortBy,
        string? sortDirection,
        CancellationToken cancellationToken);

    Task UpdateAsync(Company company, CancellationToken cancellationToken);

    Task DeleteAsync(Company company, CancellationToken cancellationToken);

    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken);

    Task<bool> ExistsByTaxIdAsync(string taxId, Guid? excludeCompanyId, CancellationToken cancellationToken);
}

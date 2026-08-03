using CompanyService.Domain.Entities;

namespace CompanyService.Domain.Repositories;

public interface ICompanyContactRepository
{
    Task AddAsync(CompanyContact contact, CancellationToken cancellationToken);

    Task<CompanyContact?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<List<CompanyContact>> GetByCompanyIdAsync(Guid companyId, CancellationToken cancellationToken);

    Task UpdateAsync(CompanyContact contact, CancellationToken cancellationToken);

    Task DeleteAsync(CompanyContact contact, CancellationToken cancellationToken);
}

using CompanyService.Domain.Entities;
using CompanyService.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CompanyService.Infrastructure.Persistence.Repositories;

public class CompanyContactRepository : ICompanyContactRepository
{
    private readonly ApplicationDbContext _context;

    public CompanyContactRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(CompanyContact contact, CancellationToken cancellationToken)
    {
        await _context.CompanyContacts.AddAsync(contact, cancellationToken);
    }

    public async Task<CompanyContact?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.CompanyContacts
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<List<CompanyContact>> GetByCompanyIdAsync(Guid companyId, CancellationToken cancellationToken)
    {
        return await _context.CompanyContacts
            .AsNoTracking()
            .Where(x => x.CompanyId == companyId)
            .OrderByDescending(x => x.IsPrimaryContact)
            .ThenByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public Task UpdateAsync(CompanyContact contact, CancellationToken cancellationToken)
    {
        _context.CompanyContacts.Update(contact);

        return Task.CompletedTask;
    }

    public Task DeleteAsync(CompanyContact contact, CancellationToken cancellationToken)
    {
        _context.CompanyContacts.Remove(contact);

        return Task.CompletedTask;
    }
}

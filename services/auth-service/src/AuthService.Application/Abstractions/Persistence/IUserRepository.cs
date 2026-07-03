using AuthService.Domain.Entities;

namespace AuthService.Application.Abstractions.Persistence;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);

    Task<User?> GetByIdAsync(Guid id);

    Task AddAsync(User user);

    Task SaveChangesAsync();
}
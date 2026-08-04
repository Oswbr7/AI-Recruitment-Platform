using AuthService.Domain.Entities;

namespace AuthService.Application.Abstractions.Persistence;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);

    Task<User?> GetByIdAsync(Guid id);

    Task<List<User>> GetAllAsync();

    Task AddAsync(User user);
}
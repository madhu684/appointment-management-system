using AMS.Domain.Entities;

namespace AMS.Domain.Interfaces;

public interface IPractitionerRepository
{
    Task<Practitioner?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<Practitioner>> GetAllActiveAsync(CancellationToken ct = default);
    Task<Practitioner> AddAsync(Practitioner practitioner, CancellationToken ct = default);
    Task UpdateAsync(Practitioner practitioner, CancellationToken ct = default);
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}

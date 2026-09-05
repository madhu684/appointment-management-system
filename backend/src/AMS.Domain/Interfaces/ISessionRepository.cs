using AMS.Domain.Entities;

namespace AMS.Domain.Interfaces;

public interface ISessionRepository
{
    Task<Session?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<Session?> GetByIdWithDetailsAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<Session>> GetByDateAsync(DateTime date, CancellationToken ct = default);
    Task<IEnumerable<Session>> GetByDateRangeAsync(DateTime start, DateTime end, CancellationToken ct = default);
    Task<IEnumerable<Session>> GetByPractitionerAsync(int practitionerId, CancellationToken ct = default);
    Task<Session> AddAsync(Session session, CancellationToken ct = default);
    Task UpdateAsync(Session session, CancellationToken ct = default);
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}

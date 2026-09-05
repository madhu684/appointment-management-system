using AMS.Domain.Entities;

namespace AMS.Domain.Interfaces;

public interface IAppointmentRepository
{
    Task<Appointment?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<Appointment?> GetByIdWithDetailsAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<Appointment>> GetAllAsync(CancellationToken ct = default);
    Task<IEnumerable<Appointment>> GetByDateAsync(DateTime date, CancellationToken ct = default);
    Task<IEnumerable<Appointment>> GetByDateRangeAsync(DateTime start, DateTime end, CancellationToken ct = default);
    Task<IEnumerable<Appointment>> GetByPractitionerAsync(int practitionerId, CancellationToken ct = default);
    Task<IEnumerable<Appointment>> GetBySessionAsync(int sessionId, CancellationToken ct = default);
    Task<int> GetNextTokenNoAsync(DateTime date, CancellationToken ct = default);
    Task<Appointment> AddAsync(Appointment appointment, CancellationToken ct = default);
    Task UpdateAsync(Appointment appointment, CancellationToken ct = default);
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}

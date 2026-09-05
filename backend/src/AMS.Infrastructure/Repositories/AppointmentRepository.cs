using AMS.Domain.Entities;
using AMS.Domain.Interfaces;
using AMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AMS.Infrastructure.Repositories;

public class AppointmentRepository : IAppointmentRepository
{
    private readonly ApplicationDbContext _context;

    public AppointmentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Appointment?> GetByIdAsync(int id, CancellationToken ct = default)
        => await _context.Appointments.FindAsync(new object[] { id }, ct);

    public async Task<Appointment?> GetByIdWithDetailsAsync(int id, CancellationToken ct = default)
        => await _context.Appointments
            .Include(a => a.Practitioner)
            .Include(a => a.Session).ThenInclude(s => s!.Practitioner)
            .Include(a => a.FollowUps)
            .FirstOrDefaultAsync(a => a.Id == id, ct);

    public async Task<IEnumerable<Appointment>> GetAllAsync(CancellationToken ct = default)
        => await _context.Appointments
            .Include(a => a.Practitioner)
            .Include(a => a.Session).ThenInclude(s => s!.Practitioner)
            .OrderByDescending(a => a.AppointmentDate)
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task<IEnumerable<Appointment>> GetByDateAsync(DateTime date, CancellationToken ct = default)
        => await _context.Appointments
            .Include(a => a.Practitioner)
            .Include(a => a.Session).ThenInclude(s => s!.Practitioner)
            .Where(a => a.AppointmentDate.Date == date.Date)
            .OrderBy(a => a.FromTime)
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task<IEnumerable<Appointment>> GetByDateRangeAsync(
        DateTime start, DateTime end, CancellationToken ct = default)
        => await _context.Appointments
            .Include(a => a.Practitioner)
            .Include(a => a.Session).ThenInclude(s => s!.Practitioner)
            .Where(a => a.AppointmentDate.Date >= start.Date && a.AppointmentDate.Date <= end.Date)
            .OrderBy(a => a.AppointmentDate).ThenBy(a => a.FromTime)
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task<IEnumerable<Appointment>> GetByPractitionerAsync(
        int practitionerId, CancellationToken ct = default)
        => await _context.Appointments
            .Include(a => a.Practitioner)
            .Where(a => a.PractitionerId == practitionerId)
            .OrderByDescending(a => a.AppointmentDate)
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task<IEnumerable<Appointment>> GetBySessionAsync(
        int sessionId, CancellationToken ct = default)
        => await _context.Appointments
            .Where(a => a.SessionId == sessionId)
            .OrderBy(a => a.FromTime)
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task<int> GetNextTokenNoAsync(DateTime date, CancellationToken ct = default)
    {
        var maxToken = await _context.Appointments
            .Where(a => a.AppointmentDate.Date == date.Date && a.TokenNo.HasValue)
            .MaxAsync(a => (int?)a.TokenNo, ct);
        return (maxToken ?? 0) + 1;
    }

    public async Task<Appointment> AddAsync(Appointment appointment, CancellationToken ct = default)
    {
        await _context.Appointments.AddAsync(appointment, ct);
        return appointment;
    }

    public Task UpdateAsync(Appointment appointment, CancellationToken ct = default)
    {
        _context.Entry(appointment).State = EntityState.Modified;
        return Task.CompletedTask;
    }

    public async Task<int> SaveChangesAsync(CancellationToken ct = default)
        => await _context.SaveChangesAsync(ct);
}

using AMS.Domain.Entities;
using AMS.Domain.Interfaces;
using AMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AMS.Infrastructure.Repositories;

public class PractitionerRepository : IPractitionerRepository
{
    private readonly ApplicationDbContext _context;

    public PractitionerRepository(ApplicationDbContext context) { _context = context; }

    public async Task<Practitioner?> GetByIdAsync(int id, CancellationToken ct = default)
        => await _context.Practitioners.FindAsync(new object[] { id }, ct);

    public async Task<IEnumerable<Practitioner>> GetAllActiveAsync(CancellationToken ct = default)
        => await _context.Practitioners
            .Where(p => p.IsActive)
            .OrderBy(p => p.FullName)
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task<Practitioner> AddAsync(Practitioner practitioner, CancellationToken ct = default)
    {
        await _context.Practitioners.AddAsync(practitioner, ct);
        return practitioner;
    }

    public Task UpdateAsync(Practitioner practitioner, CancellationToken ct = default)
    {
        _context.Entry(practitioner).State = EntityState.Modified;
        return Task.CompletedTask;
    }

    public async Task<int> SaveChangesAsync(CancellationToken ct = default)
        => await _context.SaveChangesAsync(ct);
}

public class SessionRepository : ISessionRepository
{
    private readonly ApplicationDbContext _context;

    public SessionRepository(ApplicationDbContext context) { _context = context; }

    public async Task<Session?> GetByIdAsync(int id, CancellationToken ct = default)
        => await _context.Sessions.FindAsync(new object[] { id }, ct);

    public async Task<Session?> GetByIdWithDetailsAsync(int id, CancellationToken ct = default)
        => await _context.Sessions
            .Include(s => s.Practitioner)
            .Include(s => s.Appointments)
            .FirstOrDefaultAsync(s => s.Id == id, ct);

    public async Task<IEnumerable<Session>> GetByDateAsync(DateTime date, CancellationToken ct = default)
        => await _context.Sessions
            .Include(s => s.Practitioner)
            .Include(s => s.Appointments)
            .Where(s => s.SessionDate.Date == date.Date)
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task<IEnumerable<Session>> GetByDateRangeAsync(
        DateTime start, DateTime end, CancellationToken ct = default)
        => await _context.Sessions
            .Include(s => s.Practitioner)
            .Include(s => s.Appointments)
            .Where(s => s.SessionDate.Date >= start.Date && s.SessionDate.Date <= end.Date)
            .OrderBy(s => s.SessionDate).ThenBy(s => s.StartTime)
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task<IEnumerable<Session>> GetByPractitionerAsync(
        int practitionerId, CancellationToken ct = default)
        => await _context.Sessions
            .Include(s => s.Practitioner)
            .Include(s => s.Appointments)
            .Where(s => s.PractitionerId == practitionerId)
            .OrderByDescending(s => s.SessionDate)
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task<Session> AddAsync(Session session, CancellationToken ct = default)
    {
        await _context.Sessions.AddAsync(session, ct);
        return session;
    }

    public Task UpdateAsync(Session session, CancellationToken ct = default)
    {
        _context.Entry(session).State = EntityState.Modified;
        return Task.CompletedTask;
    }

    public async Task<int> SaveChangesAsync(CancellationToken ct = default)
        => await _context.SaveChangesAsync(ct);
}

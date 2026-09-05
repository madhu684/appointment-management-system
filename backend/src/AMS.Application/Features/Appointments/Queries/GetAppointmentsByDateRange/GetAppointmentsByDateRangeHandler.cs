using AMS.Application.DTOs;
using AMS.Domain.Enums;
using AMS.Domain.Interfaces;
using MediatR;

namespace AMS.Application.Features.Appointments.Queries.GetAppointmentsByDateRange;

public class GetAppointmentsByDateRangeHandler
    : IRequestHandler<GetAppointmentsByDateRangeQuery, IEnumerable<AppointmentSummaryDto>>
{
    private readonly IAppointmentRepository _repo;

    public GetAppointmentsByDateRangeHandler(IAppointmentRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<AppointmentSummaryDto>> Handle(
        GetAppointmentsByDateRangeQuery request, CancellationToken ct)
    {
        var appointments = await _repo.GetByDateRangeAsync(request.StartDate, request.EndDate, ct);

        return appointments.Select(a => new AppointmentSummaryDto(
            a.Id, a.AppointmentDate,
            a.FromTime.ToString(@"hh\:mm"),
            a.PatientName, a.ContactNo,
            a.TokenNo, a.Status, a.Status.ToString(),
            a.Practitioner?.FullName ?? a.Session?.Practitioner?.FullName
        ));
    }
}

public class GetDashboardSummaryHandler
    : IRequestHandler<GetDashboardSummaryQuery, DashboardSummaryDto>
{
    private readonly IAppointmentRepository _repo;

    public GetDashboardSummaryHandler(IAppointmentRepository repo)
    {
        _repo = repo;
    }

    public async Task<DashboardSummaryDto> Handle(
        GetDashboardSummaryQuery request, CancellationToken ct)
    {
        var appointments = await _repo.GetByDateRangeAsync(request.StartDate, request.EndDate, ct);
        var list = appointments.ToList();

        var dailyCounts = list
            .GroupBy(a => a.AppointmentDate.Date)
            .OrderBy(g => g.Key)
            .Select(g => new DailyCountDto(
                g.Key.ToString("yyyy-MM-dd"),
                g.Count(),
                g.Count(a => a.Status == AppointmentStatus.Completed),
                g.Count(a => a.Status == AppointmentStatus.Cancelled)
            ));

        return new DashboardSummaryDto(
            list.Count,
            list.Count(a => a.Status == AppointmentStatus.Scheduled),
            list.Count(a => a.Status == AppointmentStatus.Completed),
            list.Count(a => a.Status == AppointmentStatus.Cancelled),
            list.Count(a => a.Status == AppointmentStatus.NoShow),
            dailyCounts
        );
    }
}

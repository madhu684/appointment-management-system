using AMS.Application.DTOs;
using MediatR;

namespace AMS.Application.Features.Appointments.Queries.GetAppointmentsByDateRange;

public record GetAppointmentsByDateRangeQuery(DateTime StartDate, DateTime EndDate)
    : IRequest<IEnumerable<AppointmentSummaryDto>>;

public record GetDashboardSummaryQuery(DateTime StartDate, DateTime EndDate)
    : IRequest<DashboardSummaryDto>;

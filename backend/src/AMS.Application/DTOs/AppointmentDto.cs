using AMS.Domain.Enums;

namespace AMS.Application.DTOs;

public record AppointmentDto(
    int Id,
    DateTime AppointmentDate,
    string FromTime,
    string ToTime,
    string PatientName,
    string ContactNo,
    string? Email,
    string? Notes,
    int? TokenNo,
    AppointmentStatus Status,
    string StatusDisplay,
    string? CancellationReason,
    int? SessionId,
    int? PractitionerId,
    string? PractitionerName,
    int? ParentAppointmentId,
    bool IsFollowUpNeeded,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record AppointmentSummaryDto(
    int Id,
    DateTime AppointmentDate,
    string FromTime,
    string PatientName,
    string ContactNo,
    int? TokenNo,
    AppointmentStatus Status,
    string StatusDisplay,
    string? PractitionerName
);

public record DashboardSummaryDto(
    int TotalAppointments,
    int ScheduledCount,
    int CompletedCount,
    int CancelledCount,
    int NoShowCount,
    IEnumerable<DailyCountDto> DailyCounts
);

public record DailyCountDto(string Date, int Count, int Completed, int Cancelled);

using AMS.Domain.Enums;

namespace AMS.Application.DTOs;

public record PractitionerDto(
    int Id,
    string FullName,
    string Specialization,
    string? ContactNo,
    string? Email,
    bool IsActive
);

public record SessionDto(
    int Id,
    int PractitionerId,
    string PractitionerName,
    DateTime SessionDate,
    string StartTime,
    string EndTime,
    int MaxPatients,
    int BookedCount,
    int AvailableSlots,
    SessionStatus Status,
    string StatusDisplay,
    string? Remarks
);

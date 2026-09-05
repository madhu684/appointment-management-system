using AMS.Domain.Common;
using AMS.Domain.Enums;

namespace AMS.Domain.Entities;

public class Appointment : BaseEntity
{
    public DateTime AppointmentDate { get; set; }
    public TimeSpan FromTime { get; set; }
    public TimeSpan ToTime { get; set; }

    public string PatientName { get; set; } = string.Empty;
    public string ContactNo { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Notes { get; set; }

    public int? TokenNo { get; set; }
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;
    public string? CancellationReason { get; set; }

    // Optional — link to a practitioner session
    public int? SessionId { get; set; }
    public Session? Session { get; set; }

    // Optional — direct practitioner assignment (walk-in)
    public int? PractitionerId { get; set; }
    public Practitioner? Practitioner { get; set; }

    // Self-referencing: follow-up appointments
    public int? ParentAppointmentId { get; set; }
    public Appointment? ParentAppointment { get; set; }
    public ICollection<Appointment> FollowUps { get; set; } = new List<Appointment>();
    public bool IsFollowUpNeeded { get; set; } = false;
}

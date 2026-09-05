using AMS.Domain.Common;
using AMS.Domain.Enums;

namespace AMS.Domain.Entities;

public class Session : BaseEntity
{
    public int PractitionerId { get; set; }
    public Practitioner? Practitioner { get; set; }

    public DateTime SessionDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int MaxPatients { get; set; }
    public SessionStatus Status { get; set; } = SessionStatus.Active;
    public string? Remarks { get; set; }

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    // Computed: how many slots are still available
    public int BookedCount => Appointments.Count(a =>
        a.Status != AppointmentStatus.Cancelled &&
        a.Status != AppointmentStatus.NoShow &&
        !a.IsDeleted);

    public bool HasAvailableSlots => BookedCount < MaxPatients;
}

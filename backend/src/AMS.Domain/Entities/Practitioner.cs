using AMS.Domain.Common;

namespace AMS.Domain.Entities;

public class Practitioner : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string? ContactNo { get; set; }
    public string? Email { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<Session> Sessions { get; set; } = new List<Session>();
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}

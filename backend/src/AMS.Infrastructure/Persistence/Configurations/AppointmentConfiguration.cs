using AMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AMS.Infrastructure.Persistence.Configurations;

public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
{
    public void Configure(EntityTypeBuilder<Appointment> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.PatientName).IsRequired().HasMaxLength(100);
        builder.Property(a => a.ContactNo).IsRequired().HasMaxLength(15);
        builder.Property(a => a.Email).HasMaxLength(100);
        builder.Property(a => a.Status).HasConversion<string>().HasMaxLength(50);
        builder.Property(a => a.CancellationReason).HasMaxLength(500);
        builder.Property(a => a.Notes).HasMaxLength(1000);

        // Global query filter — soft delete
        builder.HasQueryFilter(a => !a.IsDeleted);

        // Self-referencing follow-up
        builder.HasOne(a => a.ParentAppointment)
            .WithMany(a => a.FollowUps)
            .HasForeignKey(a => a.ParentAppointmentId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(a => a.Session)
            .WithMany(s => s.Appointments)
            .HasForeignKey(a => a.SessionId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(a => a.Practitioner)
            .WithMany(p => p.Appointments)
            .HasForeignKey(a => a.PractitionerId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(a => a.AppointmentDate);
        builder.HasIndex(a => a.Status);
        builder.HasIndex(a => a.PatientName);
    }
}

public class PractitionerConfiguration : IEntityTypeConfiguration<Practitioner>
{
    public void Configure(EntityTypeBuilder<Practitioner> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.FullName).IsRequired().HasMaxLength(100);
        builder.Property(p => p.Specialization).IsRequired().HasMaxLength(100);
        builder.Property(p => p.ContactNo).HasMaxLength(15);
        builder.Property(p => p.Email).HasMaxLength(100);
        builder.HasQueryFilter(p => !p.IsDeleted);
    }
}

public class SessionConfiguration : IEntityTypeConfiguration<Session>
{
    public void Configure(EntityTypeBuilder<Session> builder)
    {
        builder.HasKey(s => s.Id);
        builder.Property(s => s.Status).HasConversion<string>().HasMaxLength(50);
        builder.Property(s => s.Remarks).HasMaxLength(500);
        builder.HasQueryFilter(s => !s.IsDeleted);

        builder.HasOne(s => s.Practitioner)
            .WithMany(p => p.Sessions)
            .HasForeignKey(s => s.PractitionerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(s => s.SessionDate);
        builder.Ignore(s => s.BookedCount);
        builder.Ignore(s => s.HasAvailableSlots);
    }
}

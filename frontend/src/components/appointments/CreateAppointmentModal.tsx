import { useState, FormEvent } from 'react';
import { useCreateAppointment, usePractitioners, useSessions } from '../../hooks/useAppointments';
import type { CreateAppointmentRequest } from '../../types';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const today = new Date().toISOString().split('T')[0];
const monthEnd = new Date();
monthEnd.setDate(monthEnd.getDate() + 30);
const monthEndStr = monthEnd.toISOString().split('T')[0];

export const CreateAppointmentModal = ({ onClose, onSuccess }: Props) => {
  const [form, setForm] = useState<CreateAppointmentRequest>({
    appointmentDate: today,
    fromTime: '09:00',
    toTime: '09:30',
    patientName: '',
    contactNo: '',
    email: '',
    notes: '',
    practitionerId: undefined,
    sessionId: undefined,
    isFollowUpNeeded: false,
  });

  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: create, isPending } = useCreateAppointment();
  const { data: practitioners } = usePractitioners();
  const { data: sessions } = useSessions(new Date(), monthEnd);

  const set = (field: keyof CreateAppointmentRequest, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await create({
        ...form,
        email: form.email || undefined,
        notes: form.notes || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create appointment');
    }
  };

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.45)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-semibold">New Appointment</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body px-4">
              {error && (
                <div className="alert alert-danger alert-sm py-2 px-3 mb-3">
                  <i className="bi bi-exclamation-triangle me-2" />{error}
                </div>
              )}

              {/* Patient details */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Patient Name *</label>
                  <input
                    className="form-control"
                    value={form.patientName}
                    onChange={e => set('patientName', e.target.value)}
                    required
                    placeholder="Full name"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Contact No *</label>
                  <input
                    className="form-control"
                    value={form.contactNo}
                    onChange={e => set('contactNo', e.target.value)}
                    required
                    placeholder="07X XXX XXXX"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email ?? ''}
                    onChange={e => set('email', e.target.value)}
                    placeholder="optional"
                  />
                </div>
              </div>

              <hr className="my-3" />

              {/* Schedule */}
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label small fw-medium">Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.appointmentDate}
                    onChange={e => set('appointmentDate', e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-medium">From *</label>
                  <input
                    type="time"
                    className="form-control"
                    value={form.fromTime}
                    onChange={e => set('fromTime', e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-medium">To *</label>
                  <input
                    type="time"
                    className="form-control"
                    value={form.toTime}
                    onChange={e => set('toTime', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Practitioner or Session */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Practitioner</label>
                  <select
                    className="form-select"
                    value={form.practitionerId ?? ''}
                    onChange={e => set('practitionerId', e.target.value ? Number(e.target.value) : undefined)}
                  >
                    <option value="">— Select practitioner —</option>
                    {practitioners?.map(p => (
                      <option key={p.id} value={p.id}>{p.fullName} ({p.specialization})</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Session (optional)</label>
                  <select
                    className="form-select"
                    value={form.sessionId ?? ''}
                    onChange={e => set('sessionId', e.target.value ? Number(e.target.value) : undefined)}
                  >
                    <option value="">— Walk-in / no session —</option>
                    {sessions?.filter(s => s.availableSlots > 0).map(s => (
                      <option key={s.id} value={s.id}>
                        {s.practitionerName} — {new Date(s.sessionDate).toLocaleDateString('en-GB')}
                        {' '}({s.availableSlots} slots left)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes + follow-up */}
              <div className="mb-3">
                <label className="form-label small fw-medium">Notes</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={form.notes ?? ''}
                  onChange={e => set('notes', e.target.value)}
                  placeholder="Optional notes..."
                />
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="followUp"
                  checked={form.isFollowUpNeeded}
                  onChange={e => set('isFollowUpNeeded', e.target.checked)}
                />
                <label className="form-check-label small" htmlFor="followUp">
                  Follow-up appointment needed
                </label>
              </div>
            </div>

            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isPending}>
                {isPending
                  ? <><span className="spinner-border spinner-border-sm me-2" />Creating...</>
                  : 'Create Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

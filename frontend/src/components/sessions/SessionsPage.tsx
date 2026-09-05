import { useState, FormEvent } from 'react';
import { useSessions, useCreateSession, usePractitioners } from '../../hooks/useAppointments';
import { DateRangePicker } from '../shared/DateRangePicker';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../shared/States';
import { StatusBadge } from '../shared/StatusBadge';
import type { SessionStatus } from '../../types';

const defaultStart = () => new Date();
const defaultEnd = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d;
};

export const SessionsPage = () => {
  const [startDate, setStartDate] = useState<Date>(defaultStart());
  const [endDate, setEndDate] = useState<Date>(defaultEnd());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    practitionerId: '', sessionDate: new Date().toISOString().split('T')[0],
    startTime: '09:00', endTime: '12:00', maxPatients: '10', remarks: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const { data, isLoading, error } = useSessions(startDate, endDate);
  const { data: practitioners } = usePractitioners();
  const { mutateAsync: create, isPending } = useCreateSession();

  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await create({
        practitionerId: Number(form.practitionerId),
        sessionDate: form.sessionDate,
        startTime: form.startTime,
        endTime: form.endTime,
        maxPatients: Number(form.maxPatients),
        remarks: form.remarks || undefined,
      });
      setShowForm(false);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create session');
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h4 className="mb-1 fw-semibold">Sessions</h4>
          <p className="text-muted small mb-0">Practitioner sessions and slot availability</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'} me-1`} />
          {showForm ? 'Cancel' : 'New Session'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-0 pt-3 pb-0 px-4">
            <h6 className="fw-semibold mb-0">New Session</h6>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="card-body px-4">
              {formError && <div className="alert alert-danger py-2 px-3 small">{formError}</div>}
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Practitioner *</label>
                  <select className="form-select" value={form.practitionerId}
                    onChange={e => set('practitionerId', e.target.value)} required>
                    <option value="">— Select —</option>
                    {practitioners?.map(p => (
                      <option key={p.id} value={p.id}>{p.fullName}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Session Date *</label>
                  <input type="date" className="form-control" value={form.sessionDate}
                    onChange={e => set('sessionDate', e.target.value)} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-medium">Start Time *</label>
                  <input type="time" className="form-control" value={form.startTime}
                    onChange={e => set('startTime', e.target.value)} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-medium">End Time *</label>
                  <input type="time" className="form-control" value={form.endTime}
                    onChange={e => set('endTime', e.target.value)} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-medium">Max Patients *</label>
                  <input type="number" min={1} max={100} className="form-control"
                    value={form.maxPatients} onChange={e => set('maxPatients', e.target.value)} required />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-medium">Remarks</label>
                  <input className="form-control" value={form.remarks}
                    onChange={e => set('remarks', e.target.value)} placeholder="Optional" />
                </div>
              </div>
            </div>
            <div className="card-footer bg-white border-0 px-4 pb-4">
              <button type="submit" className="btn btn-primary btn-sm" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Session'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <DateRangePicker startDate={startDate} endDate={endDate}
            onChange={(s, e) => { setStartDate(s); setEndDate(e); }} />
        </div>
      </div>

      {/* Sessions list */}
      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message={error.message} />}
      {!isLoading && !error && !data?.length && (
        <EmptyState message="No sessions found for this date range." />
      )}
      <div className="row g-3">
        {data?.map(s => {
          const pct = Math.round((s.bookedCount / s.maxPatients) * 100);
          return (
            <div key={s.id} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="fw-semibold mb-0">{s.practitionerName}</h6>
                      <p className="text-muted small mb-0">
                        {new Date(s.sessionDate).toLocaleDateString('en-GB', {
                          weekday: 'short', day: 'numeric', month: 'short',
                        })}
                      </p>
                    </div>
                    <StatusBadge status={s.status as SessionStatus} display={s.statusDisplay} />
                  </div>

                  <div className="d-flex gap-3 mb-3 small text-muted">
                    <span><i className="bi bi-clock me-1" />{s.startTime} – {s.endTime}</span>
                  </div>

                  {/* Slots progress bar */}
                  <div className="mb-1 d-flex justify-content-between small">
                    <span className="text-muted">Slots filled</span>
                    <span className="fw-medium">{s.bookedCount} / {s.maxPatients}</span>
                  </div>
                  <div className="progress" style={{ height: 6 }}>
                    <div
                      className={`progress-bar ${pct >= 100 ? 'bg-danger' : pct >= 75 ? 'bg-warning' : 'bg-success'}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <p className="small mt-1 mb-0" style={{ color: s.availableSlots === 0 ? '#712B13' : '#085041' }}>
                    {s.availableSlots === 0 ? 'Fully booked' : `${s.availableSlots} slots available`}
                  </p>

                  {s.remarks && <p className="small text-muted mt-2 mb-0 border-top pt-2">{s.remarks}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import { useState } from 'react';
import { useAppointments } from '../../hooks/useAppointments';
import { StatusBadge } from '../shared/StatusBadge';
import { DateRangePicker } from '../shared/DateRangePicker';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../shared/States';
import { CreateAppointmentModal } from './CreateAppointmentModal';
import { AppointmentDetailModal } from './AppointmentDetailModal';
import type { AppointmentStatus } from '../../types';

const defaultStart = () => {
  const d = new Date();
  d.setDate(1);
  return d;
};

export const AppointmentsPage = () => {
  const [startDate, setStartDate] = useState<Date>(defaultStart());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data, isLoading, error, refetch } = useAppointments(startDate, endDate);

  const filtered = (data ?? []).filter(a => {
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchSearch = !search ||
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.contactNo.includes(search);
    return matchStatus && matchSearch;
  });

  const statuses: Array<AppointmentStatus | 'All'> = [
    'All', 'Scheduled', 'Confirmed', 'InProgress', 'Completed', 'Cancelled', 'NoShow',
  ];

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h4 className="mb-1 fw-semibold">Appointments</h4>
          <p className="text-muted small mb-0">
            {isLoading ? '...' : `${filtered.length} appointments`}
          </p>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowCreate(true)}
        >
          <i className="bi bi-plus-lg me-1" />New Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body d-flex flex-wrap gap-3 align-items-center">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(s, e) => { setStartDate(s); setEndDate(e); }}
          />
          <input
            className="form-control form-control-sm"
            style={{ width: 200 }}
            placeholder="Search patient / contact..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="d-flex gap-1 flex-wrap">
            {statuses.map(s => (
              <button
                key={s}
                className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-outline-secondary'}`}
                style={{ fontSize: 11, padding: '2px 10px' }}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {isLoading && <div className="p-4"><LoadingSpinner /></div>}
          {error && <div className="p-4"><ErrorMessage message={error.message} /></div>}
          {!isLoading && !error && filtered.length === 0 && (
            <EmptyState message="No appointments found for this date range and filter." />
          )}
          {!isLoading && !error && filtered.length > 0 && (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4 small fw-semibold text-muted">Token</th>
                    <th className="small fw-semibold text-muted">Date</th>
                    <th className="small fw-semibold text-muted">Time</th>
                    <th className="small fw-semibold text-muted">Patient</th>
                    <th className="small fw-semibold text-muted">Contact</th>
                    <th className="small fw-semibold text-muted">Practitioner</th>
                    <th className="small fw-semibold text-muted">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(a => (
                    <tr
                      key={a.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedId(a.id)}
                    >
                      <td className="ps-4">
                        {a.tokenNo
                          ? <span className="badge bg-light text-dark fw-bold">#{a.tokenNo}</span>
                          : <span className="text-muted">—</span>}
                      </td>
                      <td className="small">
                        {new Date(a.appointmentDate).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short',
                        })}
                      </td>
                      <td className="small text-muted">{a.fromTime}</td>
                      <td className="fw-medium small">{a.patientName}</td>
                      <td className="small text-muted">{a.contactNo}</td>
                      <td className="small text-muted">{a.practitionerName ?? '—'}</td>
                      <td>
                        <StatusBadge status={a.status} display={a.statusDisplay} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateAppointmentModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => refetch()}
        />
      )}
      {selectedId !== null && (
        <AppointmentDetailModal
          appointmentId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
};

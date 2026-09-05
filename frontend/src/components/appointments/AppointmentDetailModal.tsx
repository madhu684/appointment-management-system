import { useState } from 'react';
import { useAppointment, useUpdateAppointmentStatus, useCancelAppointment } from '../../hooks/useAppointments';
import { StatusBadge } from '../shared/StatusBadge';
import { LoadingSpinner, ErrorMessage } from '../shared/States';
import type { AppointmentStatus } from '../../types';

interface Props {
  appointmentId: number;
  onClose: () => void;
}

const STATUSES: AppointmentStatus[] = [
  'Scheduled', 'Confirmed', 'InProgress', 'Completed', 'NoShow',
];

export const AppointmentDetailModal = ({ appointmentId, onClose }: Props) => {
  const { data, isLoading, error } = useAppointment(appointmentId);
  const { mutateAsync: updateStatus, isPending: updating } = useUpdateAppointmentStatus();
  const { mutateAsync: cancel, isPending: cancelling } = useCancelAppointment();
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleStatusChange = async (status: AppointmentStatus) => {
    if (!data) return;
    setActionError(null);
    try {
      await updateStatus({ id: data.id, status, notes: data.notes ?? undefined });
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Failed to update status');
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) return;
    setActionError(null);
    try {
      await cancel({ id: appointmentId, reason: cancelReason });
      onClose();
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Failed to cancel');
    }
  };

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.45)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-semibold">
              Appointment #{data?.tokenNo ?? '—'}
            </h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body px-4">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error.message} />}
            {actionError && <ErrorMessage message={actionError} />}

            {data && (
              <>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="fw-semibold mb-1">{data.patientName}</h6>
                    <p className="text-muted small mb-0">
                      <i className="bi bi-telephone me-1" />{data.contactNo}
                      {data.email && <><span className="mx-2">·</span><i className="bi bi-envelope me-1" />{data.email}</>}
                    </p>
                  </div>
                  <StatusBadge status={data.status} display={data.statusDisplay} />
                </div>

                <div className="row g-2 mb-3 small text-muted">
                  <div className="col-6">
                    <i className="bi bi-calendar me-1" />
                    {new Date(data.appointmentDate).toLocaleDateString('en-GB', {
                      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </div>
                  <div className="col-6">
                    <i className="bi bi-clock me-1" />{data.fromTime} – {data.toTime}
                  </div>
                  {data.practitionerName && (
                    <div className="col-12">
                      <i className="bi bi-person-badge me-1" />{data.practitionerName}
                    </div>
                  )}
                  {data.notes && (
                    <div className="col-12">
                      <i className="bi bi-journal-text me-1" />{data.notes}
                    </div>
                  )}
                  {data.isFollowUpNeeded && (
                    <div className="col-12">
                      <span className="badge" style={{ background: '#FAEEDA', color: '#633806' }}>
                        <i className="bi bi-arrow-repeat me-1" />Follow-up needed
                      </span>
                    </div>
                  )}
                  {data.cancellationReason && (
                    <div className="col-12 text-danger">
                      <i className="bi bi-x-circle me-1" />Cancelled: {data.cancellationReason}
                    </div>
                  )}
                </div>

                {/* Status update */}
                {data.status !== 'Cancelled' && (
                  <div className="mb-3">
                    <p className="small fw-medium mb-2">Update status</p>
                    <div className="d-flex flex-wrap gap-2">
                      {STATUSES.filter(s => s !== data.status).map(s => (
                        <button
                          key={s}
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleStatusChange(s)}
                          disabled={updating}
                        >
                          {updating ? '...' : s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cancel */}
                {data.status !== 'Cancelled' && data.status !== 'Completed' && (
                  showCancelForm ? (
                    <div className="border rounded p-3 bg-light">
                      <p className="small fw-medium mb-2 text-danger">Cancel appointment</p>
                      <input
                        className="form-control form-control-sm mb-2"
                        placeholder="Reason for cancellation *"
                        value={cancelReason}
                        onChange={e => setCancelReason(e.target.value)}
                      />
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={handleCancel}
                          disabled={cancelling || !cancelReason.trim()}
                        >
                          {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setShowCancelForm(false)}
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setShowCancelForm(true)}
                    >
                      <i className="bi bi-x-circle me-1" />Cancel Appointment
                    </button>
                  )
                )}
              </>
            )}
          </div>

          <div className="modal-footer border-0 pt-0">
            <button className="btn btn-outline-secondary btn-sm" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

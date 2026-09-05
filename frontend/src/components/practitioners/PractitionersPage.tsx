import { useState, FormEvent } from 'react';
import { usePractitioners, useCreatePractitioner } from '../../hooks/useAppointments';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../shared/States';

export const PractitionersPage = () => {
  const { data, isLoading, error } = usePractitioners();
  const { mutateAsync: create, isPending } = useCreatePractitioner();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: '', specialization: '', contactNo: '', email: '' });
  const [formError, setFormError] = useState<string | null>(null);

  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await create({ ...form, contactNo: form.contactNo || undefined, email: form.email || undefined });
      setForm({ fullName: '', specialization: '', contactNo: '', email: '' });
      setShowForm(false);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create');
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="mb-1 fw-semibold">Practitioners</h4>
          <p className="text-muted small mb-0">{data?.length ?? 0} active practitioners</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'} me-1`} />
          {showForm ? 'Cancel' : 'Add Practitioner'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-0 pt-3 pb-0 px-4">
            <h6 className="fw-semibold mb-0">New Practitioner</h6>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="card-body px-4">
              {formError && <div className="alert alert-danger py-2 px-3 small">{formError}</div>}
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Full Name *</label>
                  <input className="form-control" value={form.fullName}
                    onChange={e => set('fullName', e.target.value)} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Specialization *</label>
                  <input className="form-control" value={form.specialization}
                    onChange={e => set('specialization', e.target.value)}
                    placeholder="e.g. Ayurvedic Physician" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Contact No</label>
                  <input className="form-control" value={form.contactNo}
                    onChange={e => set('contactNo', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-medium">Email</label>
                  <input type="email" className="form-control" value={form.email}
                    onChange={e => set('email', e.target.value)} />
                </div>
              </div>
            </div>
            <div className="card-footer bg-white border-0 px-4 pb-4">
              <button type="submit" className="btn btn-primary btn-sm" disabled={isPending}>
                {isPending ? 'Adding...' : 'Add Practitioner'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="row g-3">
        {isLoading && <div className="col-12"><LoadingSpinner /></div>}
        {error && <div className="col-12"><ErrorMessage message={error.message} /></div>}
        {!isLoading && !error && !data?.length && (
          <div className="col-12"><EmptyState message="No practitioners added yet." /></div>
        )}
        {data?.map(p => (
          <div key={p.id} className="col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-start gap-3">
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: '#E1F5EE', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <i className="bi bi-person-badge" style={{ color: '#085041', fontSize: 20 }} />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-semibold">{p.fullName}</h6>
                    <p className="text-muted small mb-1">{p.specialization}</p>
                    {p.contactNo && (
                      <p className="small mb-0 text-muted">
                        <i className="bi bi-telephone me-1" />{p.contactNo}
                      </p>
                    )}
                    {p.email && (
                      <p className="small mb-0 text-muted">
                        <i className="bi bi-envelope me-1" />{p.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

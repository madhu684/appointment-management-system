interface Props {
  startDate: Date;
  endDate: Date;
  onChange: (start: Date, end: Date) => void;
}

const fmt = (d: Date) => d.toISOString().split('T')[0];

export const DateRangePicker = ({ startDate, endDate, onChange }: Props) => (
  <div className="d-flex align-items-center gap-2 flex-wrap">
    <label className="text-muted small mb-0">From</label>
    <input
      type="date"
      className="form-control form-control-sm"
      style={{ width: 'auto' }}
      value={fmt(startDate)}
      onChange={e => onChange(new Date(e.target.value), endDate)}
    />
    <label className="text-muted small mb-0">To</label>
    <input
      type="date"
      className="form-control form-control-sm"
      style={{ width: 'auto' }}
      value={fmt(endDate)}
      onChange={e => onChange(startDate, new Date(e.target.value))}
    />
  </div>
);

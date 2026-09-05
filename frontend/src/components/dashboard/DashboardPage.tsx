import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useDashboard } from '../../hooks/useAppointments';
import { DateRangePicker } from '../shared/DateRangePicker';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../shared/States';

const defaultStart = () => {
  const d = new Date();
  d.setDate(1);
  return d;
};

const defaultEnd = () => new Date();

export const DashboardPage = () => {
  const [startDate, setStartDate] = useState<Date>(defaultStart());
  const [endDate, setEndDate] = useState<Date>(defaultEnd());

  const { data, isLoading, error } = useDashboard(startDate, endDate);

  const handleDateChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const stats = [
    { label: 'Total', value: data?.totalAppointments ?? 0, color: '#0C447C', icon: 'bi-calendar3' },
    { label: 'Scheduled', value: data?.scheduledCount ?? 0, color: '#185FA5', icon: 'bi-calendar-check' },
    { label: 'Completed', value: data?.completedCount ?? 0, color: '#085041', icon: 'bi-check-circle' },
    { label: 'Cancelled', value: data?.cancelledCount ?? 0, color: '#712B13', icon: 'bi-x-circle' },
    { label: 'No Show', value: data?.noShowCount ?? 0, color: '#444441', icon: 'bi-person-x' },
  ];

  // Fix: extract safely to avoid undefined errors
  const dailyCounts = data?.dailyCounts ?? [];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h4 className="mb-1 fw-semibold">Dashboard</h4>
          <p className="text-muted small mb-0">Appointment overview by date range</p>
        </div>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateChange}
        />
      </div>

      {/* Summary cards */}
      <div className="row g-3 mb-4">
        {stats.map(s => (
          <div key={s.label} className="col-6 col-md-4 col-lg">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: s.color + '18',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: 20 }} />
                </div>
                <div>
                  <div className="text-muted small">{s.label}</div>
                  <div className="fw-bold fs-4" style={{ color: s.color, lineHeight: 1.2 }}>
                    {isLoading ? '—' : s.value}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
          <h6 className="mb-0 fw-semibold">Daily Appointments</h6>
          <p className="text-muted small mb-0">Appointments, completions and cancellations by day</p>
        </div>
        <div className="card-body px-2">
          {isLoading && <LoadingSpinner text="Loading chart data..." />}
          {error && <ErrorMessage message={error.message} />}
          {!isLoading && !error && dailyCounts.length === 0 && (
            <EmptyState message="No appointment data for this date range." />
          )}
          {!isLoading && !error && dailyCounts.length > 0 && (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={dailyCounts}
                margin={{ top: 10, right: 24, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(d: string) => {
                    const dt = new Date(d);
                    return `${dt.getDate()}/${dt.getMonth() + 1}`;
                  }}
                />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(value: number, name: string) => [value, name]}
                  labelFormatter={(d: string) => {
                    const dt = new Date(d);
                    return dt.toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    });
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="count" name="Total" fill="#378ADD" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#1D9E75" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cancelled" name="Cancelled" fill="#D85A30" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
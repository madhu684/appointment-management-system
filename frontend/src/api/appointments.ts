import { api } from './client';
import type {
  Appointment, AppointmentSummary, DashboardSummary,
  CreateAppointmentRequest, Practitioner, CreatePractitionerRequest,
  Session, CreateSessionRequest, AppointmentStatus
} from '../types';

const fmt = (d: Date) => d.toISOString().split('T')[0];

// ─── Appointments ──────────────────────────────────────────────────
export const getAppointments = async (startDate: Date, endDate: Date) => {
  const res = await api.get<AppointmentSummary[]>('/appointments', {
    params: { startDate: fmt(startDate), endDate: fmt(endDate) },
  });
  return res.data;
};

export const getAppointmentById = async (id: number) => {
  const res = await api.get<Appointment>(`/appointments/${id}`);
  return res.data;
};

export const getDashboard = async (startDate: Date, endDate: Date) => {
  const res = await api.get<DashboardSummary>('/appointments/dashboard', {
    params: { startDate: fmt(startDate), endDate: fmt(endDate) },
  });
  return res.data;
};

export const createAppointment = async (data: CreateAppointmentRequest) => {
  const res = await api.post<Appointment>('/appointments', data);
  return res.data;
};

export const updateAppointmentStatus = async (
  id: number,
  status: AppointmentStatus,
  notes?: string,
  isFollowUpNeeded = false
) => {
  const res = await api.patch<Appointment>(`/appointments/${id}`, {
    status, notes, isFollowUpNeeded,
  });
  return res.data;
};

export const cancelAppointment = async (id: number, reason: string) => {
  await api.delete(`/appointments/${id}`, { params: { reason } });
};

// ─── Practitioners ─────────────────────────────────────────────────
export const getPractitioners = async () => {
  const res = await api.get<Practitioner[]>('/practitioners');
  return res.data;
};

export const createPractitioner = async (data: CreatePractitionerRequest) => {
  const res = await api.post<Practitioner>('/practitioners', data);
  return res.data;
};

// ─── Sessions ──────────────────────────────────────────────────────
export const getSessions = async (startDate: Date, endDate: Date) => {
  const res = await api.get<Session[]>('/sessions', {
    params: { startDate: fmt(startDate), endDate: fmt(endDate) },
  });
  return res.data;
};

export const createSession = async (data: CreateSessionRequest) => {
  const res = await api.post<Session>('/sessions', data);
  return res.data;
};

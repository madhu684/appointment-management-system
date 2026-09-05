import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/appointments';
import type { CreateAppointmentRequest, AppointmentStatus } from '../types';

export const QUERY_KEYS = {
  appointments: (start: string, end: string) => ['appointments', start, end],
  appointment: (id: number) => ['appointment', id],
  dashboard: (start: string, end: string) => ['dashboard', start, end],
  practitioners: ['practitioners'],
  sessions: (start: string, end: string) => ['sessions', start, end],
};

const fmt = (d: Date) => d.toISOString().split('T')[0];

// ─── Appointments ──────────────────────────────────────────────────
export const useAppointments = (startDate: Date, endDate: Date) =>
  useQuery({
    queryKey: QUERY_KEYS.appointments(fmt(startDate), fmt(endDate)),
    queryFn: () => api.getAppointments(startDate, endDate),
    staleTime: 30_000,
  });

export const useAppointment = (id: number) =>
  useQuery({
    queryKey: QUERY_KEYS.appointment(id),
    queryFn: () => api.getAppointmentById(id),
    enabled: id > 0,
  });

export const useDashboard = (startDate: Date, endDate: Date) =>
  useQuery({
    queryKey: QUERY_KEYS.dashboard(fmt(startDate), fmt(endDate)),
    queryFn: () => api.getDashboard(startDate, endDate),
    staleTime: 60_000,
  });

export const useCreateAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) => api.createAppointment(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  });
};

export const useUpdateAppointmentStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id, status, notes, isFollowUpNeeded,
    }: { id: number; status: AppointmentStatus; notes?: string; isFollowUpNeeded?: boolean }) =>
      api.updateAppointmentStatus(id, status, notes, isFollowUpNeeded),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['appointments'] });
      qc.invalidateQueries({ queryKey: ['appointment'] });
    },
  });
};

export const useCancelAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      api.cancelAppointment(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  });
};

// ─── Practitioners ─────────────────────────────────────────────────
export const usePractitioners = () =>
  useQuery({
    queryKey: QUERY_KEYS.practitioners,
    queryFn: api.getPractitioners,
    staleTime: 5 * 60_000,
  });

export const useCreatePractitioner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createPractitioner,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.practitioners }),
  });
};

// ─── Sessions ──────────────────────────────────────────────────────
export const useSessions = (startDate: Date, endDate: Date) =>
  useQuery({
    queryKey: QUERY_KEYS.sessions(fmt(startDate), fmt(endDate)),
    queryFn: () => api.getSessions(startDate, endDate),
    staleTime: 30_000,
  });

export const useCreateSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createSession,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sessions'] }),
  });
};

export type AppointmentStatus =
  | 'Scheduled'
  | 'Confirmed'
  | 'InProgress'
  | 'Completed'
  | 'Cancelled'
  | 'NoShow';

export type SessionStatus = 'Active' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: number;
  appointmentDate: string;
  fromTime: string;
  toTime: string;
  patientName: string;
  contactNo: string;
  email?: string;
  notes?: string;
  tokenNo?: number;
  status: AppointmentStatus;
  statusDisplay: string;
  cancellationReason?: string;
  sessionId?: number;
  practitionerId?: number;
  practitionerName?: string;
  parentAppointmentId?: number;
  isFollowUpNeeded: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AppointmentSummary {
  id: number;
  appointmentDate: string;
  fromTime: string;
  patientName: string;
  contactNo: string;
  tokenNo?: number;
  status: AppointmentStatus;
  statusDisplay: string;
  practitionerName?: string;
}

export interface DashboardSummary {
  totalAppointments: number;
  scheduledCount: number;
  completedCount: number;
  cancelledCount: number;
  noShowCount: number;
  dailyCounts: DailyCount[];
}

export interface DailyCount {
  date: string;
  count: number;
  completed: number;
  cancelled: number;
}

export interface Practitioner {
  id: number;
  fullName: string;
  specialization: string;
  contactNo?: string;
  email?: string;
  isActive: boolean;
}

export interface Session {
  id: number;
  practitionerId: number;
  practitionerName: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  maxPatients: number;
  bookedCount: number;
  availableSlots: number;
  status: SessionStatus;
  statusDisplay: string;
  remarks?: string;
}

export interface CreateAppointmentRequest {
  appointmentDate: string;
  fromTime: string;
  toTime: string;
  patientName: string;
  contactNo: string;
  email?: string;
  notes?: string;
  sessionId?: number;
  practitionerId?: number;
  parentAppointmentId?: number;
  isFollowUpNeeded: boolean;
}

export interface CreatePractitionerRequest {
  fullName: string;
  specialization: string;
  contactNo?: string;
  email?: string;
}

export interface CreateSessionRequest {
  practitionerId: number;
  sessionDate: string;
  startTime: string;
  endTime: string;
  maxPatients: number;
  remarks?: string;
}

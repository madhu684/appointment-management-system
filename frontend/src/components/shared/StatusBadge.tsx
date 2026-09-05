import type { AppointmentStatus, SessionStatus } from '../../types';

interface AppointmentBadgeProps {
  status: AppointmentStatus;
  display: string;
}

interface SessionBadgeProps {
  status: SessionStatus;
  display: string;
}

const appointmentConfig: Record<AppointmentStatus, { bg: string; text: string }> = {
  Scheduled:  { bg: '#E6F1FB', text: '#0C447C' },
  Confirmed:  { bg: '#E1F5EE', text: '#085041' },
  InProgress: { bg: '#FAEEDA', text: '#633806' },
  Completed:  { bg: '#EAF3DE', text: '#27500A' },
  Cancelled:  { bg: '#FAECE7', text: '#712B13' },
  NoShow:     { bg: '#F1EFE8', text: '#444441' },
};

const sessionConfig: Record<SessionStatus, { bg: string; text: string }> = {
  Active:    { bg: '#E1F5EE', text: '#085041' },
  Completed: { bg: '#EAF3DE', text: '#27500A' },
  Cancelled: { bg: '#FAECE7', text: '#712B13' },
};

const Badge = ({ bg, text, display }: { bg: string; text: string; display: string }) => (
  <span style={{
    background: bg, color: text,
    padding: '3px 10px', borderRadius: '99px',
    fontSize: '12px', fontWeight: 500,
    display: 'inline-block', whiteSpace: 'nowrap',
  }}>
    {display}
  </span>
);

export const StatusBadge = ({ status, display }: AppointmentBadgeProps) => {
  const style = appointmentConfig[status] ?? appointmentConfig.Scheduled;
  return <Badge bg={style.bg} text={style.text} display={display} />;
};

export const SessionStatusBadge = ({ status, display }: SessionBadgeProps) => {
  const style = sessionConfig[status] ?? sessionConfig.Active;
  return <Badge bg={style.bg} text={style.text} display={display} />;
};
import type { AppointmentStatus } from '../../types';

interface Props {
  status: AppointmentStatus;
  display: string;
}

const config: Record<AppointmentStatus, { bg: string; text: string }> = {
  Scheduled:  { bg: '#E6F1FB', text: '#0C447C' },
  Confirmed:  { bg: '#E1F5EE', text: '#085041' },
  InProgress: { bg: '#FAEEDA', text: '#633806' },
  Completed:  { bg: '#EAF3DE', text: '#27500A' },
  Cancelled:  { bg: '#FAECE7', text: '#712B13' },
  NoShow:     { bg: '#F1EFE8', text: '#444441' },
};

export const StatusBadge = ({ status, display }: Props) => {
  const { bg, text } = config[status] ?? config.Scheduled;
  return (
    <span style={{
      background: bg, color: text,
      padding: '3px 10px', borderRadius: '99px',
      fontSize: '12px', fontWeight: 500,
      display: 'inline-block', whiteSpace: 'nowrap',
    }}>
      {display}
    </span>
  );
};

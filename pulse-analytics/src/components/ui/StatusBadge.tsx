import { cn } from '@/lib/utils';

type StatusType = 'connected' | 'disconnected' | 'expired' | 'syncing' | 'error';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; bg: string; color: string; icon: string }> = {
  connected: {
    label: 'Connected',
    bg: 'bg-tertiary/10',
    color: 'text-tertiary',
    icon: 'check_circle',
  },
  disconnected: {
    label: 'Disconnected',
    bg: 'bg-outline/10',
    color: 'text-outline',
    icon: 'link_off',
  },
  expired: {
    label: 'Expired',
    bg: 'bg-error/10',
    color: 'text-error',
    icon: 'schedule',
  },
  syncing: {
    label: 'Syncing...',
    bg: 'bg-primary/10',
    color: 'text-primary',
    icon: 'sync',
  },
  error: {
    label: 'Error',
    bg: 'bg-error/10',
    color: 'text-error',
    icon: 'error',
  },
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase',
        config.bg,
        config.color,
        className
      )}
    >
      <span className="material-symbols-outlined text-xs" style={{ fontSize: '12px' }}>
        {config.icon}
      </span>
      {config.label}
    </span>
  );
}

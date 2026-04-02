import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  icon: string;
  iconBg?: string;
  iconColor?: string;
  className?: string;
}

export default function KpiCard({
  title,
  value,
  delta,
  deltaPositive,
  icon,
  iconBg = 'bg-primary-fixed',
  iconColor = 'text-primary',
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        'bg-surface-container-lowest p-6 rounded-xl border-none shadow-[0_8px_24px_rgba(19,27,46,0.06)] group hover:-translate-y-1 transition-all duration-300',
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`p-2 ${iconBg} rounded-lg ${iconColor} material-symbols-outlined`}>
          {icon}
        </span>
        <span
          className={`text-xs font-bold flex items-center gap-1 ${
            deltaPositive ? 'text-tertiary' : 'text-error'
          }`}
        >
          <span className="material-symbols-outlined text-xs">
            {deltaPositive ? 'arrow_upward' : 'arrow_downward'}
          </span>
          {delta}
        </span>
      </div>
      <p className="text-secondary text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-black text-on-surface tracking-tight">
        {value}
      </h3>
    </div>
  );
}

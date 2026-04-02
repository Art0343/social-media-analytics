import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-surface-container rounded-lg',
        className
      )}
    />
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-surface-container-lowest p-6 rounded-xl shadow-sm space-y-4',
        className
      )}
    >
      <div className="flex justify-between items-start">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="w-16 h-4" />
      </div>
      <Skeleton className="w-24 h-4" />
      <Skeleton className="w-32 h-8" />
    </div>
  );
}

export function SkeletonChart({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-surface-container-lowest p-8 rounded-xl shadow-sm space-y-4',
        className
      )}
    >
      <Skeleton className="w-48 h-6" />
      <Skeleton className="w-32 h-4" />
      <Skeleton className="w-full h-48 mt-4" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, className }: SkeletonProps & { rows?: number }) {
  return (
    <div
      className={cn(
        'bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden',
        className
      )}
    >
      <div className="p-4 bg-surface-container-low">
        <Skeleton className="w-full h-8" />
      </div>
      <div className="divide-y divide-surface-container">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4">
            <Skeleton className="w-20 h-5" />
            <Skeleton className="w-24 h-5" />
            <Skeleton className="flex-1 h-5" />
            <Skeleton className="w-16 h-5" />
            <Skeleton className="w-16 h-5" />
          </div>
        ))}
      </div>
    </div>
  );
}

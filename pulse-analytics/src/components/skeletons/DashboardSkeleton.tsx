export default function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-8 animate-pulse">
      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-xl h-32">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-surface-container rounded-lg" />
              <div className="w-16 h-4 bg-surface-container rounded" />
            </div>
            <div className="w-24 h-8 bg-surface-container rounded mb-2" />
            <div className="w-32 h-4 bg-surface-container rounded" />
          </div>
        ))}
      </div>

      {/* Charts Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-xl h-80">
          <div className="w-48 h-6 bg-surface-container rounded mb-4" />
          <div className="h-64 bg-surface-container rounded" />
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl h-80">
          <div className="w-32 h-6 bg-surface-container rounded mb-4" />
          <div className="h-48 bg-surface-container rounded" />
        </div>
      </div>

      {/* Platform Performance Skeleton */}
      <div className="bg-surface-container-lowest p-6 rounded-xl">
        <div className="w-48 h-6 bg-surface-container rounded mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-8 h-8 bg-surface-container rounded-full" />
              <div className="flex-1 h-4 bg-surface-container rounded" />
              <div className="w-24 h-4 bg-surface-container rounded" />
              <div className="w-24 h-4 bg-surface-container rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

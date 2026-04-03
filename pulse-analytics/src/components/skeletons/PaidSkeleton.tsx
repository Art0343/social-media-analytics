export default function PaidSkeleton() {
  return (
    <div className="p-8 space-y-8 animate-pulse">
      {/* Header */}
      <div className="w-64 h-10 bg-surface-container rounded" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-xl h-28">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-surface-container rounded-lg" />
              <div className="w-16 h-4 bg-surface-container rounded" />
            </div>
            <div className="w-32 h-8 bg-surface-container rounded" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl h-72">
          <div className="w-40 h-6 bg-surface-container rounded mb-4" />
          <div className="h-56 bg-surface-container rounded" />
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl h-72">
          <div className="w-48 h-6 bg-surface-container rounded mb-4" />
          <div className="h-56 bg-surface-container rounded" />
        </div>
      </div>

      {/* Boosted Posts Table */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10">
          <div className="w-48 h-6 bg-surface-container rounded" />
        </div>
        <div className="divide-y divide-outline-variant/10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-surface-container rounded-lg" />
              <div className="flex-1 h-4 bg-surface-container rounded" />
              <div className="w-24 h-4 bg-surface-container rounded" />
              <div className="w-20 h-6 bg-surface-container rounded-full" />
              <div className="w-16 h-4 bg-surface-container rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

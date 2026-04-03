export default function InsightsSkeleton() {
  return (
    <div className="p-10 space-y-10 animate-pulse">
      {/* Hero Card */}
      <div className="bg-surface-container-lowest rounded-xl p-10 h-64">
        <div className="flex gap-4 mb-6">
          <div className="w-12 h-12 bg-surface-container rounded-lg" />
          <div className="w-48 h-4 bg-surface-container rounded" />
        </div>
        <div className="w-96 h-10 bg-surface-container rounded mb-4" />
        <div className="w-64 h-6 bg-surface-container rounded mb-6" />
        <div className="flex gap-4">
          <div className="w-40 h-20 bg-surface-container rounded-xl" />
          <div className="w-40 h-20 bg-surface-container rounded-xl" />
        </div>
      </div>

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface-container-lowest p-8 rounded-xl h-56">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-surface-container rounded-xl" />
              <div className="w-20 h-4 bg-surface-container rounded" />
            </div>
            <div className="w-48 h-6 bg-surface-container rounded mb-2" />
            <div className="w-full h-16 bg-surface-container rounded" />
          </div>
        ))}
      </div>

      {/* ROI Table */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10">
          <div className="w-48 h-6 bg-surface-container rounded" />
        </div>
        <div className="divide-y divide-outline-variant/10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-surface-container rounded-lg" />
              <div className="flex-1 h-4 bg-surface-container rounded" />
              <div className="w-20 h-6 bg-surface-container rounded-full" />
              <div className="w-16 h-4 bg-surface-container rounded" />
              <div className="w-16 h-4 bg-surface-container rounded" />
              <div className="w-12 h-4 bg-surface-container rounded" />
              <div className="w-10 h-10 bg-surface-container rounded-full" />
              <div className="w-20 h-6 bg-surface-container rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

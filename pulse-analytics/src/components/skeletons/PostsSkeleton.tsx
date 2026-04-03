export default function PostsSkeleton() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="w-48 h-8 bg-surface-container rounded" />
        <div className="w-32 h-10 bg-surface-container rounded-lg" />
      </div>

      {/* Search and Filter Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 h-12 bg-surface-container rounded-lg" />
        <div className="w-40 h-12 bg-surface-container rounded-lg" />
        <div className="w-40 h-12 bg-surface-container rounded-lg" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="bg-surface-container-low p-4">
          <div className="grid grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-surface-container rounded" />
            ))}
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-outline-variant/10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4">
              <div className="grid grid-cols-6 gap-4 items-center">
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-container rounded-lg" />
                  <div className="flex-1 h-4 bg-surface-container rounded" />
                </div>
                <div className="h-6 w-16 bg-surface-container rounded-full" />
                <div className="h-4 bg-surface-container rounded" />
                <div className="h-4 bg-surface-container rounded" />
                <div className="h-4 bg-surface-container rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-between items-center">
        <div className="w-32 h-4 bg-surface-container rounded" />
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-10 h-10 bg-surface-container rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

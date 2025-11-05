export default function ConcertSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );
}

export function TimelineLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <ConcertSkeleton key={i} />
      ))}
    </div>
  );
}

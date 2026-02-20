'use client';

/**
 * ChartSkeleton - Loading skeleton for charts
 */

export function DonutChartSkeleton() {
  return (
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg animate-pulse">
      <div className="w-32 h-32 bg-gray-300 rounded-full" />
    </div>
  );
}

export function BalanceChartSkeleton() {
  return (
    <div className="flex flex-col gap-4 h-72 bg-gray-100 rounded-lg animate-pulse">
      <div className="flex-1 flex gap-2 items-end px-4 py-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-300 rounded"
            style={{
              height: `${20 + Math.random() * 60}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
        <DonutChartSkeleton />
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
        <DonutChartSkeleton />
      </div>
      <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
        <BalanceChartSkeleton />
      </div>
    </div>
  );
}

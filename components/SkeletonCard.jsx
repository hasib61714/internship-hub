import { cn } from '@/lib/utils';

function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-md bg-gray-200 dark:bg-gray-700', className)} />;
}

export function JobCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="flex justify-between pt-2 border-t border-gray-50 dark:border-gray-700">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 flex items-center gap-4">
      <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function ListRowSkeleton({ rows = 4 }) {
  return (
    <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-6 py-4 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

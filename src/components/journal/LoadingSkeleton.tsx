import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <div className="w-full space-y-8">
      {/* Calendar Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-1">
          <div className="w-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-3 w-6 mb-1" />
            ))}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-4 w-8" />
              ))}
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <Skeleton key={j} className="h-3 w-3 rounded-sm" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mood Selector Skeleton */}
      <div className="flex justify-center gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-8 w-8" />
        ))}
      </div>

      {/* Editor Skeleton */}
      <Skeleton className="h-[calc(100vh-300px)] w-full" />
    </div>
  );
} 
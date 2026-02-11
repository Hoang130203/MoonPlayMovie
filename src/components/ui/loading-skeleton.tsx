interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-skeleton rounded ${className}`} />
}

export function MovieCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}

export function MovieGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function HeroBannerSkeleton() {
  return (
    <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden">
      <Skeleton className="w-full h-full" />
    </div>
  )
}

export function DetailPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-8">
        <Skeleton className="w-full md:w-72 aspect-[2/3] rounded-xl shrink-0" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2 pt-4">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

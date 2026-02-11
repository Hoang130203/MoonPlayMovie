import { useLatestMovies, useCategoryMovies } from '../hooks/use-movie-queries'
import { HeroBanner } from '../components/movie/hero-banner'
import { MovieGridSection } from '../components/movie/movie-grid-section'
import { HeroBannerSkeleton, MovieGridSkeleton } from '../components/ui/loading-skeleton'
import { ErrorFallback } from '../components/ui/error-fallback'

export function HomePage() {
  const latest = useLatestMovies(1)
  const phimBo = useCategoryMovies('phim-bo', 1)
  const phimLe = useCategoryMovies('phim-le', 1)
  const hoatHinh = useCategoryMovies('hoat-hinh', 1)

  return (
    <div className="space-y-10 pb-8">
      {/* Hero Banner */}
      <section>
        {latest.isLoading && <HeroBannerSkeleton />}
        {latest.isError && (
          <ErrorFallback
            message="Không thể tải banner. Vui lòng thử lại."
            onRetry={() => latest.refetch()}
          />
        )}
        {latest.data && <HeroBanner movies={latest.data.items} />}
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-10">
        {/* Latest movies */}
        <MovieSection
          title="Phim mới cập nhật"
          query={latest}
          dataExtractor={(d) => d.items.slice(0, 10)}
          viewAllPath="/danh-muc/phim-moi-cap-nhat"
        />

        {/* Phim bộ */}
        <V1Section
          title="Phim bộ"
          query={phimBo}
          viewAllPath="/danh-muc/phim-bo"
        />

        {/* Phim lẻ */}
        <V1Section
          title="Phim lẻ"
          query={phimLe}
          viewAllPath="/danh-muc/phim-le"
        />

        {/* Hoạt hình */}
        <V1Section
          title="Hoạt hình"
          query={hoatHinh}
          viewAllPath="/danh-muc/hoat-hinh"
        />
      </div>
    </div>
  )
}

// Helper for /api response shape
function MovieSection({
  title,
  query,
  dataExtractor,
  viewAllPath,
}: {
  title: string
  query: ReturnType<typeof useLatestMovies>
  dataExtractor: (data: NonNullable<typeof query.data>) => NonNullable<typeof query.data>['items']
  viewAllPath?: string
}) {
  if (query.isLoading) return <MovieGridSkeleton count={10} />
  if (query.isError) return <ErrorFallback message={`Lỗi tải ${title}`} onRetry={() => query.refetch()} />
  if (!query.data) return null

  return (
    <MovieGridSection
      title={title}
      movies={dataExtractor(query.data)}
      viewAllPath={viewAllPath}
    />
  )
}

// Helper for /v1/api response shape
function V1Section({
  title,
  query,
  viewAllPath,
}: {
  title: string
  query: ReturnType<typeof useCategoryMovies>
  viewAllPath?: string
}) {
  if (query.isLoading) return <MovieGridSkeleton count={10} />
  if (query.isError) return <ErrorFallback message={`Lỗi tải ${title}`} onRetry={() => query.refetch()} />
  if (!query.data?.data?.items) return null

  return (
    <MovieGridSection
      title={title}
      movies={query.data.data.items.slice(0, 10)}
      viewAllPath={viewAllPath}
    />
  )
}

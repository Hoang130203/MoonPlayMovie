import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLatestMovies, useCategoryMovies } from '../hooks/use-movie-queries'
import { HeroBanner } from '../components/movie/hero-banner'
import { MovieGridSection } from '../components/movie/movie-grid-section'
import { WatchHistorySection } from '../components/movie/watch-history-section'
import { HeroBannerSkeleton, MovieGridSkeleton } from '../components/ui/loading-skeleton'
import { ErrorFallback } from '../components/ui/error-fallback'

export function HomePage() {
  const navigate = useNavigate()
  const latest = useLatestMovies(1)
  const phimBo = useCategoryMovies('phim-bo', 1)
  const phimLe = useCategoryMovies('phim-le', 1)
  const hoatHinh = useCategoryMovies('hoat-hinh', 1)
  const [isSpinning, setIsSpinning] = useState(false)

  const handleRandomMovie = () => {
    if (!latest.data?.items.length || isSpinning) return

    setIsSpinning(true)
    const randomIndex = Math.floor(Math.random() * latest.data.items.length)
    const randomMovie = latest.data.items[randomIndex]

    setTimeout(() => {
      navigate(`/phim/${randomMovie.slug}`)
    }, 300)
  }

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
        {/* Random Movie Button */}
        {latest.data && (
          <div className="flex justify-center animate-fade-in">
            <button
              onClick={handleRandomMovie}
              disabled={isSpinning}
              className="group inline-flex items-center gap-3 px-6 py-3 glass hover:bg-white/10 rounded-xl text-white transition-all duration-300 btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${isSpinning ? 'animate-spin' : 'group-hover:rotate-180'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="gradient-text-purple font-semibold">Hôm nay xem gì?</span>
            </button>
          </div>
        )}

        {/* Watch History */}
        <WatchHistorySection />

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

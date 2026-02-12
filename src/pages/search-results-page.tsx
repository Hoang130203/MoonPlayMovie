import { useSearchParams } from 'react-router-dom'
import { useSearchMovies } from '../hooks/use-movie-queries'
import { MovieCard } from '../components/movie/movie-card'
import { MovieGridSkeleton } from '../components/ui/loading-skeleton'
import { ErrorFallback, EmptyState } from '../components/ui/error-fallback'
import { PaginationControls } from '../components/ui/pagination-controls'
import { showLoader } from '../lib/page-loader-state'

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get('q') || ''
  const page = Number(searchParams.get('page')) || 1
  const { data, isLoading, isError, refetch } = useSearchMovies(keyword, page)

  function handlePageChange(newPage: number) {
    showLoader()
    setSearchParams({ q: keyword, page: String(newPage) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 section-title-line">
        Kết quả tìm kiếm
      </h1>
      {keyword && (
        <p className="text-gray-400 mb-6 mt-4">
          Từ khóa: <span className="gradient-text-purple font-medium">"{keyword}"</span>
        </p>
      )}

      {!keyword && (
        <EmptyState message="Vui lòng nhập từ khóa tìm kiếm (ít nhất 2 ký tự)." />
      )}

      {keyword && isLoading && <MovieGridSkeleton count={20} />}

      {keyword && isError && (
        <ErrorFallback
          message="Không thể tìm kiếm. Vui lòng thử lại."
          onRetry={() => refetch()}
        />
      )}

      {keyword && data?.data?.items && (
        <>
          {data.data.items.length === 0 ? (
            <EmptyState message={`Không tìm thấy phim nào cho "${keyword}".`} />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 stagger-children">
                {data.data.items.map((movie) => (
                  <MovieCard key={movie._id || movie.slug} movie={movie} />
                ))}
              </div>

              <PaginationControls
                currentPage={data.data.params.pagination.currentPage}
                totalPages={data.data.params.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}

import { useParams, useSearchParams } from 'react-router-dom'
import { useCategoryMovies } from '../hooks/use-movie-queries'
import { MovieCard } from '../components/movie/movie-card'
import { MovieGridSkeleton } from '../components/ui/loading-skeleton'
import { ErrorFallback, EmptyState } from '../components/ui/error-fallback'
import { PaginationControls } from '../components/ui/pagination-controls'
import { showLoader } from '../lib/page-loader-state'

const CATEGORY_LABELS: Record<string, string> = {
  'phim-bo': 'Phim bộ',
  'phim-le': 'Phim lẻ',
  'hoat-hinh': 'Hoạt hình',
  'tv-shows': 'TV Shows',
  'phim-moi-cap-nhat': 'Phim mới cập nhật',
}

export function BrowseByCategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const { data, isLoading, isError, refetch } = useCategoryMovies(slug || '', page)

  const title = CATEGORY_LABELS[slug || ''] || slug || 'Danh mục'

  function handlePageChange(newPage: number) {
    showLoader()
    setSearchParams({ page: String(newPage) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 section-title-line">{title}</h1>

      {isLoading && <MovieGridSkeleton count={20} />}

      {isError && (
        <ErrorFallback
          message={`Không thể tải danh sách ${title}.`}
          onRetry={() => refetch()}
        />
      )}

      {data?.data?.items && (
        <>
          {data.data.items.length === 0 ? (
            <EmptyState message="Không có phim nào trong danh mục này." />
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

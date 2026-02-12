import { buildPageNumbers } from '../../lib/format-utils'
import type { Pagination } from '../../types/movie-types'

interface PaginationControlsProps {
  pagination: Pagination
  onPageChange: (page: number) => void
}

/**
 * Pagination component that calculates totalPages from API pagination data.
 * Accepts the raw pagination object from the API.
 */
export function PaginationControls({
  pagination,
  onPageChange,
}: PaginationControlsProps) {
  const { currentPage, totalItems, totalItemsPerPage } = pagination
  const totalPages = pagination.totalPages || Math.ceil(totalItems / totalItemsPerPage)

  if (totalPages <= 1) return null

  const pages = buildPageNumbers(currentPage, totalPages)

  return (
    <nav className="flex items-center justify-center gap-1.5 py-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-2 rounded-xl glass hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 text-sm text-gray-300 hover:text-white"
      >
        ‹ Trước
      </button>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`e-${idx}`} className="px-2 text-gray-500">
            …
          </span>
        ) : (
          <button
            key={`p-${page}`}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-300 ${
              page === currentPage
                ? 'bg-accent-purple text-white shadow-lg shadow-purple-500/30'
                : 'glass text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-2 rounded-xl glass hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 text-sm text-gray-300 hover:text-white"
      >
        Sau ›
      </button>
    </nav>
  )
}

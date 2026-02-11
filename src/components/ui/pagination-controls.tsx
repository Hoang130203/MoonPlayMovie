import { buildPageNumbers } from '../../lib/format-utils'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null

  const pages = buildPageNumbers(currentPage, totalPages)

  return (
    <nav className="flex items-center justify-center gap-1.5 py-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-2 rounded-lg bg-dark-700 hover:bg-dark-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
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
            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? 'bg-accent-purple text-white'
                : 'bg-dark-700 hover:bg-dark-600 text-gray-300'
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-2 rounded-lg bg-dark-700 hover:bg-dark-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
      >
        Sau ›
      </button>
    </nav>
  )
}

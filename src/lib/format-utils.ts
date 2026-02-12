/**
 * Truncate text to a max length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

/**
 * Strip HTML tags from content string (movie descriptions)
 */
export function stripHtml(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || ''
}

/**
 * Build page numbers array for pagination.
 * Shows first, last, and 5 pages nearest to current with ellipsis gaps.
 * Example: [1, '...', 4, 5, (6), 7, 8, '...', 20]
 */
export function buildPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '...')[] = []

  // 5 pages centered around current
  const start = Math.max(1, Math.min(current - 2, total - 4))
  const end = Math.min(total, Math.max(current + 2, 5))

  // First page + ellipsis if window doesn't start at 1
  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('...')
  }

  // Window of 5 pages
  for (let i = start; i <= end; i++) pages.push(i)

  // Ellipsis + last page if window doesn't reach end
  if (end < total) {
    if (end < total - 1) pages.push('...')
    pages.push(total)
  }

  return pages
}

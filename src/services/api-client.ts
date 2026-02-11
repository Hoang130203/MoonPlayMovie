import axios from 'axios'

// Primary client for root endpoints (latest movies, movie detail, genres, countries)
// OPhim uses root paths without /api prefix for these endpoints
export const apiClient = axios.create({
  baseURL: '/ophim-api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Secondary client for /v1/api endpoints (search, category filtering)
export const v1ApiClient = axios.create({
  baseURL: '/v1/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// OPhim CDN base for images
const IMAGE_CDN = 'https://img.ophim.live/uploads/movies'

/**
 * Build full image URL from OPhim thumb/poster path.
 * Handles both relative paths and already-full URLs.
 */
export function buildImageUrl(path: string): string {
  if (!path) return '/placeholder-movie.svg'
  if (path.startsWith('http')) return path
  return `${IMAGE_CDN}/${path}`
}

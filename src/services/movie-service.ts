import { apiClient, v1ApiClient } from './api-client'
import type {
  MovieListResponse,
  MovieDetailResponse,
  CategoryItem,
  V1ApiResponse,
} from '../types/movie-types'

export async function fetchLatestMovies(page = 1): Promise<MovieListResponse> {
  const { data } = await apiClient.get<MovieListResponse>(
    `/danh-sach/phim-moi-cap-nhat`,
    { params: { page } }
  )
  return data
}

export async function fetchMovieDetail(slug: string): Promise<MovieDetailResponse> {
  const { data } = await apiClient.get<MovieDetailResponse>(`/phim/${slug}`)
  return data
}

export async function searchMovies(keyword: string, page = 1): Promise<V1ApiResponse> {
  const { data } = await v1ApiClient.get<V1ApiResponse>('/tim-kiem', {
    params: { keyword, page },
  })
  return data
}

export async function fetchGenres(): Promise<CategoryItem[]> {
  const { data } = await apiClient.get<CategoryItem[]>('/the-loai')
  return data
}

export async function fetchCountries(): Promise<CategoryItem[]> {
  const { data } = await apiClient.get<CategoryItem[]>('/quoc-gia')
  return data
}

export async function fetchByCategory(slug: string, page = 1): Promise<V1ApiResponse> {
  const { data } = await v1ApiClient.get<V1ApiResponse>(`/danh-sach/${slug}`, {
    params: { page },
  })
  return data
}

import { useQuery } from '@tanstack/react-query'
import {
  fetchLatestMovies,
  fetchMovieDetail,
  searchMovies,
  fetchGenres,
  fetchCountries,
  fetchByCategory,
} from '../services/movie-service'

export function useLatestMovies(page = 1) {
  return useQuery({
    queryKey: ['latest-movies', page],
    queryFn: () => fetchLatestMovies(page),
    staleTime: 5 * 60 * 1000,
  })
}

export function useMovieDetail(slug: string) {
  return useQuery({
    queryKey: ['movie-detail', slug],
    queryFn: () => fetchMovieDetail(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  })
}

export function useSearchMovies(keyword: string, page = 1) {
  return useQuery({
    queryKey: ['search-movies', keyword, page],
    queryFn: () => searchMovies(keyword, page),
    enabled: keyword.length >= 2,
    staleTime: 3 * 60 * 1000,
  })
}

export function useGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: fetchGenres,
    staleTime: 30 * 60 * 1000,
  })
}

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    staleTime: 30 * 60 * 1000,
  })
}

export function useCategoryMovies(slug: string, page = 1) {
  return useQuery({
    queryKey: ['category-movies', slug, page],
    queryFn: () => fetchByCategory(slug, page),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  })
}

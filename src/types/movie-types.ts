// OPhim API response types

export interface MovieItem {
  _id: string
  name: string
  slug: string
  origin_name: string
  thumb_url: string
  poster_url: string
  year: number
  type: string
  quality: string
  lang: string
  episode_current: string
  category: CategoryRef[]
  country: CountryRef[]
  modified: { time: string }
}

export interface CategoryRef {
  id?: string
  name: string
  slug: string
}

export interface CountryRef {
  id?: string
  name: string
  slug: string
}

export interface Pagination {
  totalItems: number
  totalItemsPerPage: number
  currentPage: number
  totalPages?: number
  pageRanges?: number
}

export interface MovieListResponse {
  status: boolean
  items: MovieItem[]
  pagination: Pagination
}

export interface MovieDetail {
  name: string
  slug: string
  origin_name: string
  content: string
  thumb_url: string
  poster_url: string
  trailer_url: string
  episode_current: string
  episode_total: string
  quality: string
  lang: string
  year: number
  type: string
  time: string
  actor: string[]
  director: string[]
  category: CategoryRef[]
  country: CountryRef[]
  status: string
}

export interface EpisodeData {
  name: string
  slug: string
  filename: string
  link_embed: string
  link_m3u8: string
}

export interface EpisodeServer {
  server_name: string
  server_data: EpisodeData[]
}

export interface MovieDetailResponse {
  status: boolean
  movie: MovieDetail
  episodes: EpisodeServer[]
}

export interface CategoryItem {
  _id: string
  name: string
  slug: string
}

// Search & category list share the same shape as MovieListResponse
// but the data wrapper differs for /v1/api endpoints
export interface V1ApiResponse {
  status: string
  data: {
    items: MovieItem[]
    params: {
      pagination: Pagination
    }
    titlePage: string
  }
}

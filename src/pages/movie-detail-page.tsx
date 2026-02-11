import { useParams, Link } from 'react-router-dom'
import { useMovieDetail, useLatestMovies } from '../hooks/use-movie-queries'
import { buildImageUrl } from '../services/api-client'
import { stripHtml } from '../lib/format-utils'
import { DetailPageSkeleton } from '../components/ui/loading-skeleton'
import { ErrorFallback } from '../components/ui/error-fallback'
import { MovieGridSection } from '../components/movie/movie-grid-section'
import { useState } from 'react'

export function MovieDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data, isLoading, isError, refetch } = useMovieDetail(slug || '')
  const related = useLatestMovies(1)

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DetailPageSkeleton />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ErrorFallback
          message="Không tìm thấy phim hoặc đã xảy ra lỗi."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  const { movie, episodes } = data

  return (
    <div className="animate-fade-in">
      {/* Backdrop */}
      <MovieBackdrop posterUrl={movie.poster_url || movie.thumb_url} />

      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10 space-y-10 pb-8">
        {/* Main info */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <MoviePoster movie={movie} />
          <MovieInfo movie={movie} episodes={episodes} />
        </div>

        {/* Description */}
        {movie.content && (
          <section>
            <h2 className="text-xl font-bold text-white mb-3">Nội dung phim</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              {stripHtml(movie.content)}
            </p>
          </section>
        )}

        {/* Episodes */}
        {episodes.length > 0 && (
          <EpisodeSection episodes={episodes} movieSlug={movie.slug} />
        )}

        {/* Related movies */}
        {related.data && (
          <MovieGridSection
            title="Phim đề xuất"
            movies={related.data.items.slice(0, 10)}
          />
        )}
      </div>
    </div>
  )
}

function MovieBackdrop({ posterUrl }: { posterUrl: string }) {
  return (
    <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
      <img
        src={buildImageUrl(posterUrl)}
        alt=""
        className="w-full h-full object-cover blur-sm scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900/50 via-dark-900/70 to-dark-900" />
    </div>
  )
}

function MoviePoster({ movie }: { movie: { thumb_url: string; name: string } }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="w-48 md:w-72 shrink-0 mx-auto md:mx-0">
      <img
        src={imgError ? '/placeholder-movie.svg' : buildImageUrl(movie.thumb_url)}
        alt={movie.name}
        onError={() => setImgError(true)}
        className="w-full rounded-xl shadow-2xl shadow-black/50"
      />
    </div>
  )
}

function MovieInfo({
  movie,
  episodes,
}: {
  movie: NonNullable<import('../types/movie-types').MovieDetailResponse['movie']>
  episodes: import('../types/movie-types').EpisodeServer[]
}) {
  const firstEpisode = episodes[0]?.server_data?.[0]

  return (
    <div className="flex-1 space-y-4">
      <h1 className="text-2xl md:text-4xl font-bold text-white">{movie.name}</h1>
      <p className="text-gray-400 text-sm">{movie.origin_name}</p>

      {/* Meta badges */}
      <div className="flex flex-wrap gap-2">
        {movie.quality && (
          <span className="px-2.5 py-1 bg-accent-red text-white text-xs font-bold rounded">
            {movie.quality}
          </span>
        )}
        {movie.lang && (
          <span className="px-2.5 py-1 bg-accent-purple text-white text-xs rounded">
            {movie.lang}
          </span>
        )}
        {movie.year && (
          <span className="px-2.5 py-1 bg-dark-600 text-gray-300 text-xs rounded">
            {movie.year}
          </span>
        )}
        {movie.time && (
          <span className="px-2.5 py-1 bg-dark-600 text-gray-300 text-xs rounded">
            {movie.time}
          </span>
        )}
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        {movie.episode_current && (
          <InfoRow label="Tập phim" value={movie.episode_current} />
        )}
        {movie.episode_total && (
          <InfoRow label="Tổng tập" value={movie.episode_total} />
        )}
        {movie.director?.length > 0 && (
          <InfoRow label="Đạo diễn" value={movie.director.join(', ')} />
        )}
        {movie.category?.length > 0 && (
          <InfoRow
            label="Thể loại"
            value={movie.category.map((c) => c.name).join(', ')}
          />
        )}
        {movie.country?.length > 0 && (
          <InfoRow
            label="Quốc gia"
            value={movie.country.map((c) => c.name).join(', ')}
          />
        )}
      </div>

      {/* CTA buttons */}
      <div className="flex items-center gap-3 pt-2">
        {firstEpisode && (
          <Link
            to={`/xem-phim/${movie.slug}?tap=${firstEpisode.slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-purple hover:bg-accent-purple/80 text-white rounded-lg font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Xem phim
          </Link>
        )}
        {movie.trailer_url && (
          <a
            href={movie.trailer_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors backdrop-blur-sm"
          >
            Trailer
          </a>
        )}
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-gray-500">{label}: </span>
      <span className="text-gray-200">{value}</span>
    </div>
  )
}

function EpisodeSection({
  episodes,
  movieSlug,
}: {
  episodes: import('../types/movie-types').EpisodeServer[]
  movieSlug: string
}) {
  const [activeServer, setActiveServer] = useState(0)
  const server = episodes[activeServer]

  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-3">Danh sách tập</h2>

      {/* Server tabs */}
      {episodes.length > 1 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {episodes.map((ep, idx) => (
            <button
              key={ep.server_name}
              onClick={() => setActiveServer(idx)}
              className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
                idx === activeServer
                  ? 'bg-accent-purple text-white'
                  : 'bg-dark-600 text-gray-300 hover:bg-dark-500'
              }`}
            >
              {ep.server_name}
            </button>
          ))}
        </div>
      )}

      {/* Episode grid */}
      <div className="flex flex-wrap gap-2">
        {server?.server_data.map((ep) => (
          <Link
            key={ep.slug}
            to={`/xem-phim/${movieSlug}?tap=${ep.slug}`}
            className="px-4 py-2 bg-dark-700 hover:bg-accent-purple/30 text-gray-200 hover:text-white text-sm rounded-lg transition-colors border border-dark-500 hover:border-accent-purple"
          >
            {ep.name}
          </Link>
        ))}
      </div>
    </section>
  )
}

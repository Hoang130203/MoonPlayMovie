import { Link } from 'react-router-dom'
import { buildImageUrl } from '../../services/api-client'
import type { MovieItem } from '../../types/movie-types'
import { useState } from 'react'

interface MovieCardProps {
  movie: MovieItem
}

export function MovieCard({ movie }: MovieCardProps) {
  const [imgError, setImgError] = useState(false)
  const imageUrl = imgError
    ? '/placeholder-movie.svg'
    : buildImageUrl(movie.thumb_url)

  return (
    <Link
      to={`/phim/${movie.slug}`}
      className="group block movie-card-hover rounded-xl overflow-hidden"
    >
      {/* Poster with glow border */}
      <div className="movie-card-glow relative aspect-[2/3] bg-dark-700 rounded-xl overflow-hidden">
        <img
          src={imageUrl}
          alt={movie.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400" />

        {/* Glass overlay at bottom on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-dark-900/95 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />

        {/* Quality badge */}
        {movie.quality && (
          <span className="absolute top-2 left-2 px-2 py-0.5 badge-gradient-red text-white text-xs font-bold rounded-md shadow-lg shadow-red-500/20">
            {movie.quality}
          </span>
        )}

        {/* Episode badge */}
        {movie.episode_current && (
          <span className="absolute top-2 right-2 px-2 py-0.5 badge-gradient-purple text-white text-xs font-medium rounded-md shadow-lg shadow-purple-500/20">
            {movie.episode_current}
          </span>
        )}

        {/* Language badge */}
        {movie.lang && (
          <span className="absolute bottom-2 left-2 px-2 py-0.5 glass text-gray-200 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            {movie.lang}
          </span>
        )}

        {/* Play icon on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 rounded-full bg-accent-purple/90 flex items-center justify-center play-btn-pulse backdrop-blur-sm border border-white/20 scale-75 group-hover:scale-100 transition-transform duration-400">
            <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 px-1">
        <h3 className="text-sm font-medium text-white line-clamp-1 group-hover:text-accent-purple-light transition-colors duration-300">
          {movie.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-1 group-hover:text-gray-400 transition-colors duration-300">
          {movie.origin_name} {movie.year ? `(${movie.year})` : ''}
        </p>
      </div>
    </Link>
  )
}

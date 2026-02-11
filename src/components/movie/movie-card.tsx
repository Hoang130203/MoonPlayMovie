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
      className="group block movie-card-hover rounded-lg overflow-hidden"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-dark-700 rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt={movie.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quality badge */}
        {movie.quality && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-accent-red text-white text-xs font-bold rounded">
            {movie.quality}
          </span>
        )}

        {/* Episode badge */}
        {movie.episode_current && (
          <span className="absolute top-2 right-2 px-2 py-0.5 bg-accent-purple text-white text-xs font-medium rounded">
            {movie.episode_current}
          </span>
        )}

        {/* Language badge */}
        {movie.lang && (
          <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-gray-200 text-xs rounded">
            {movie.lang}
          </span>
        )}

        {/* Play icon on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-accent-purple/90 flex items-center justify-center">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="pt-2.5 px-1">
        <h3 className="text-sm font-medium text-white line-clamp-1 group-hover:text-accent-purple-light transition-colors">
          {movie.name}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
          {movie.origin_name} {movie.year ? `(${movie.year})` : ''}
        </p>
      </div>
    </Link>
  )
}

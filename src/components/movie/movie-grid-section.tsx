import { Link } from 'react-router-dom'
import type { MovieItem } from '../../types/movie-types'
import { MovieCard } from './movie-card'

interface MovieGridSectionProps {
  title: string
  movies: MovieItem[]
  viewAllPath?: string
}

export function MovieGridSection({ title, movies, viewAllPath }: MovieGridSectionProps) {
  if (!movies.length) return null

  return (
    <section className="animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl md:text-2xl font-bold text-white section-title-line">
          {title}
        </h2>
        {viewAllPath && (
          <Link
            to={viewAllPath}
            className="text-sm text-gray-400 hover:text-accent-purple-light transition-all duration-300 flex items-center gap-1 group hover-underline"
          >
            Xem tất cả
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 stagger-children">
        {movies.map((movie) => (
          <MovieCard key={movie._id || movie.slug} movie={movie} />
        ))}
      </div>
    </section>
  )
}

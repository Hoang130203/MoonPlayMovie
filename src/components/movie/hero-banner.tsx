import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'
import 'swiper/swiper-bundle.css'
import { buildImageUrl } from '../../services/api-client'
import type { MovieItem } from '../../types/movie-types'

interface HeroBannerProps {
  movies: MovieItem[]
}

export function HeroBanner({ movies }: HeroBannerProps) {
  const featured = movies.slice(0, 5)

  if (!featured.length) return null

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="w-full aspect-[21/9] md:aspect-[21/8] rounded-none md:rounded-xl overflow-hidden"
      >
        {featured.map((movie) => (
          <SwiperSlide key={movie._id || movie.slug}>
            <HeroSlide movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

function HeroSlide({ movie }: { movie: MovieItem }) {
  const bgImage = buildImageUrl(movie.poster_url || movie.thumb_url)

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background image with Ken Burns */}
      <img
        src={bgImage}
        alt={movie.name}
        className="w-full h-full object-cover animate-ken-burns"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900/95 via-dark-900/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-dark-900/30" />
      {/* Subtle purple tint overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 via-transparent to-accent-cyan/5" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
          <div className="max-w-lg space-y-3 md:space-y-4">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {movie.quality && (
                <span className="px-2.5 py-1 badge-gradient-red text-white text-xs font-bold rounded-md shadow-lg shadow-red-500/25">
                  {movie.quality}
                </span>
              )}
              {movie.lang && (
                <span className="px-2.5 py-1 badge-gradient-purple text-white text-xs font-medium rounded-md shadow-lg shadow-purple-500/25">
                  {movie.lang}
                </span>
              )}
              {movie.year && (
                <span className="px-2.5 py-1 glass text-white text-xs rounded-md">
                  {movie.year}
                </span>
              )}
            </div>

            {/* Title with gradient */}
            <h1
              className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight gradient-text animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              {movie.name}
            </h1>

            <p
              className="text-sm text-gray-300/80 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              {movie.origin_name}
            </p>

            {/* Categories */}
            {movie.category?.length > 0 && (
              <p
                className="text-xs text-gray-400 animate-fade-in-up"
                style={{ animationDelay: '0.35s' }}
              >
                {movie.category.map((c) => c.name).join(' • ')}
              </p>
            )}

            {/* Episode info */}
            {movie.episode_current && (
              <p
                className="text-sm gradient-text-purple font-medium animate-fade-in-up"
                style={{ animationDelay: '0.4s' }}
              >
                {movie.episode_current}
              </p>
            )}

            {/* CTA */}
            <div
              className="flex items-center gap-3 pt-2 animate-fade-in-up"
              style={{ animationDelay: '0.45s' }}
            >
              <Link
                to={`/phim/${movie.slug}`}
                className="btn-glow inline-flex items-center gap-2 px-7 py-3 bg-accent-purple text-white rounded-xl font-semibold text-sm shadow-lg shadow-purple-500/30 relative z-10"
              >
                <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="relative z-10">Xem ngay</span>
              </Link>
              <Link
                to={`/phim/${movie.slug}`}
                className="inline-flex items-center gap-2 px-7 py-3 glass hover:bg-white/15 text-white rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
              >
                Chi tiết
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

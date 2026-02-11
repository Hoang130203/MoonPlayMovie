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
    <div className="relative w-full h-full">
      {/* Background image */}
      <img
        src={bgImage}
        alt={movie.name}
        className="w-full h-full object-cover"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900/95 via-dark-900/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-dark-900/30" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
          <div className="max-w-lg space-y-3 md:space-y-4">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {movie.quality && (
                <span className="px-2 py-0.5 bg-accent-red text-white text-xs font-bold rounded">
                  {movie.quality}
                </span>
              )}
              {movie.lang && (
                <span className="px-2 py-0.5 bg-accent-purple text-white text-xs font-medium rounded">
                  {movie.lang}
                </span>
              )}
              {movie.year && (
                <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded">
                  {movie.year}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {movie.name}
            </h1>

            <p className="text-sm text-gray-300">
              {movie.origin_name}
            </p>

            {/* Categories */}
            {movie.category?.length > 0 && (
              <p className="text-xs text-gray-400">
                {movie.category.map((c) => c.name).join(' • ')}
              </p>
            )}

            {/* Episode info */}
            {movie.episode_current && (
              <p className="text-sm text-accent-purple-light">
                {movie.episode_current}
              </p>
            )}

            {/* CTA */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                to={`/phim/${movie.slug}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent-purple hover:bg-accent-purple/80 text-white rounded-lg font-medium transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Xem ngay
              </Link>
              <Link
                to={`/phim/${movie.slug}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors text-sm backdrop-blur-sm"
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

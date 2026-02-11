import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useMovieDetail, useLatestMovies } from '../hooks/use-movie-queries'
import { HlsVideoPlayer } from '../components/player/hls-video-player'
import { buildImageUrl } from '../services/api-client'
import { DetailPageSkeleton } from '../components/ui/loading-skeleton'
import { ErrorFallback } from '../components/ui/error-fallback'
import { MovieGridSection } from '../components/movie/movie-grid-section'
import { useState, useMemo } from 'react'

export function MoviePlayerPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentEpSlug = searchParams.get('tap') || '1'
  const { data, isLoading, isError, refetch } = useMovieDetail(slug || '')
  const related = useLatestMovies(1)
  const [activeServer, setActiveServer] = useState(0)

  const currentEpisode = useMemo(() => {
    if (!data?.episodes?.length) return null
    const server = data.episodes[activeServer]
    return server?.server_data.find((ep) => ep.slug === currentEpSlug) || server?.server_data[0]
  }, [data, activeServer, currentEpSlug])

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
        <ErrorFallback message="Không thể tải phim." onRetry={() => refetch()} />
      </div>
    )
  }

  const { movie, episodes } = data
  const videoSrc = currentEpisode?.link_m3u8 || currentEpisode?.link_embed || ''

  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Video player */}
        <section>
          {videoSrc ? (
            videoSrc.includes('.m3u8') ? (
              <HlsVideoPlayer
                src={videoSrc}
                poster={buildImageUrl(movie.poster_url || movie.thumb_url)}
              />
            ) : (
              <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
                <iframe
                  src={videoSrc}
                  className="w-full h-full"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                  title={movie.name}
                />
              </div>
            )
          ) : (
            <ErrorFallback message="Không tìm thấy link phát video cho tập này." />
          )}
        </section>

        {/* Movie title & episode info */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-white">
              {movie.name}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {movie.origin_name}
              {currentEpisode && ` - Tập ${currentEpisode.name}`}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              {movie.quality && (
                <span className="px-2 py-0.5 bg-accent-red text-white text-xs font-bold rounded">
                  {movie.quality}
                </span>
              )}
              {movie.lang && (
                <span className="px-2 py-0.5 bg-accent-purple text-white text-xs rounded">
                  {movie.lang}
                </span>
              )}
              {movie.year && (
                <span className="px-2 py-0.5 bg-dark-600 text-gray-300 text-xs rounded">
                  {movie.year}
                </span>
              )}
            </div>
          </div>

          <Link
            to={`/phim/${movie.slug}`}
            className="inline-flex items-center gap-2 px-5 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-white rounded-lg text-sm transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Chi tiết phim
          </Link>
        </div>

        {/* Server tabs + Episode selector */}
        {episodes.length > 0 && (
          <section className="bg-dark-800 rounded-xl p-4 md:p-6">
            <h2 className="text-lg font-bold text-white mb-3">Danh sách tập</h2>

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

            {/* Episodes grid */}
            <div className="flex flex-wrap gap-2">
              {episodes[activeServer]?.server_data.map((ep) => {
                const isActive = ep.slug === currentEpSlug
                return (
                  <button
                    key={ep.slug}
                    onClick={() => setSearchParams({ tap: ep.slug })}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors border ${
                      isActive
                        ? 'bg-accent-purple text-white border-accent-purple'
                        : 'bg-dark-700 text-gray-300 hover:bg-accent-purple/20 hover:text-white border-dark-500 hover:border-accent-purple'
                    }`}
                  >
                    {ep.name}
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* Related movies */}
        {related.data && (
          <MovieGridSection
            title="Có thể bạn muốn xem"
            movies={related.data.items.slice(5, 15)}
          />
        )}
      </div>
    </div>
  )
}

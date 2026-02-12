import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useMovieDetail, useLatestMovies } from '../hooks/use-movie-queries'
import { HlsVideoPlayer } from '../components/player/hls-video-player'
import { buildImageUrl } from '../services/api-client'
import { DetailPageSkeleton } from '../components/ui/loading-skeleton'
import { ErrorFallback } from '../components/ui/error-fallback'
import { MovieGridSection } from '../components/movie/movie-grid-section'
import { showLoader, hideLoader } from '../lib/page-loader-state'
import { useState, useMemo, useEffect, useCallback } from 'react'

export function MoviePlayerPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentEpSlug = searchParams.get('tap') || '1'
  const { data, isLoading, isError, refetch } = useMovieDetail(slug || '')
  const related = useLatestMovies(1)
  const [activeServer, setActiveServer] = useState(0)
  const [theaterMode, setTheaterMode] = useState(false)

  const currentEpisode = useMemo(() => {
    if (!data?.episodes?.length) return null
    const server = data.episodes[activeServer]
    return server?.server_data.find((ep) => ep.slug === currentEpSlug) || server?.server_data[0]
  }, [data, activeServer, currentEpSlug])

  // Hide loader when episode data resolves
  useEffect(() => {
    if (currentEpisode) {
      const t = setTimeout(() => hideLoader(), 400)
      return () => clearTimeout(t)
    }
  }, [currentEpisode])

  const handleEpisodeChange = useCallback((epSlug: string) => {
    showLoader()
    setSearchParams({ tap: epSlug })
  }, [setSearchParams])

  const handleServerChange = useCallback((idx: number) => {
    showLoader()
    setActiveServer(idx)
  }, [])

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
      {/* Theater mode overlay - click to dismiss */}
      {theaterMode && (
        <div
          className="fixed inset-0 bg-black/85 z-40 cursor-pointer animate-fade-in"
          onClick={() => setTheaterMode(false)}
        />
      )}

      <div className={`max-w-7xl mx-auto px-4 py-6 space-y-6 ${theaterMode ? 'relative z-50' : ''}`}>
        {/* Video player */}
        <section className={theaterMode ? 'theater-player-glow' : ''}>
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

        {/* Movie title & controls */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold gradient-text">
              {movie.name}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {movie.origin_name}
              {currentEpisode && ` - Tập ${currentEpisode.name}`}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              {movie.quality && (
                <span className="px-2 py-0.5 badge-gradient-red text-white text-xs font-bold rounded-md">
                  {movie.quality}
                </span>
              )}
              {movie.lang && (
                <span className="px-2 py-0.5 badge-gradient-purple text-white text-xs rounded-md">
                  {movie.lang}
                </span>
              )}
              {movie.year && (
                <span className="px-2 py-0.5 glass text-gray-300 text-xs rounded-md">
                  {movie.year}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Theater mode toggle */}
            <button
              onClick={() => setTheaterMode(!theaterMode)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
                theaterMode
                  ? 'bg-accent-purple text-white shadow-lg shadow-purple-500/30'
                  : 'glass text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              title={theaterMode ? 'Tắt chế độ rạp chiếu' : 'Bật chế độ rạp chiếu'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {theaterMode ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                )}
              </svg>
              {theaterMode ? 'Bật đèn' : 'Tắt đèn'}
            </button>

            <Link
              to={`/phim/${movie.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 glass hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-sm transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Chi tiết
            </Link>
          </div>
        </div>

        {/* Server tabs + Episode selector */}
        {episodes.length > 0 && (
          <section className="glass rounded-xl p-4 md:p-6">
            <h2 className="text-lg font-bold text-white mb-3 section-title-line">Danh sách tập</h2>

            {/* Server tabs */}
            {episodes.length > 1 && (
              <div className="flex gap-2 mb-4 flex-wrap mt-4">
                {episodes.map((ep, idx) => (
                  <button
                    key={ep.server_name}
                    onClick={() => handleServerChange(idx)}
                    className={`px-4 py-1.5 text-sm rounded-xl transition-all duration-300 ${idx === activeServer
                        ? 'bg-accent-purple text-white shadow-lg shadow-purple-500/25'
                        : 'bg-dark-700 text-gray-300 hover:text-white hover:bg-dark-600'
                      }`}
                  >
                    {ep.server_name}
                  </button>
                ))}
              </div>
            )}

            {/* Episodes grid */}
            <div className="flex flex-wrap gap-2 mt-4">
              {episodes[activeServer]?.server_data.map((ep) => {
                const isActive = ep.slug === currentEpSlug
                return (
                  <button
                    key={ep.slug}
                    onClick={() => handleEpisodeChange(ep.slug)}
                    className={`episode-btn px-4 py-2 text-sm rounded-xl border relative ${isActive
                        ? 'bg-accent-purple text-white border-accent-purple shadow-lg shadow-purple-500/25'
                        : 'bg-dark-700 text-gray-300 hover:text-white border-dark-500'
                      }`}
                  >
                    <span className="relative z-10">{ep.name}</span>
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

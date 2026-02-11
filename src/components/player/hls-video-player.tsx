import { useRef, useEffect, useState, useCallback } from 'react'
import Hls from 'hls.js'

interface HlsVideoPlayerProps {
  src: string
  poster?: string
}

export function HlsVideoPlayer({ src, poster }: HlsVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Reset state when src changes (React-recommended pattern)
  const [prevSrc, setPrevSrc] = useState(src)
  if (prevSrc !== src) {
    setPrevSrc(src)
    setError(null)
    setLoading(true)
  }

  const retry = useCallback(() => {
    setError(null)
    setLoading(true)
    // Force re-init by bumping prevSrc
    setPrevSrc('')
    requestAnimationFrame(() => setPrevSrc(src))
  }, [src])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    // Cleanup previous instance
    hlsRef.current?.destroy()
    hlsRef.current = null

    // HLS.js for m3u8
    if (src.includes('.m3u8') && Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        startLevel: -1,
      })
      hlsRef.current = hls

      hls.loadSource(src)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false)
        video.play().catch(() => {})
      })

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('Lỗi mạng - không thể tải video.')
              hls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError()
              break
            default:
              setError('Không thể phát video này.')
              hls.destroy()
              break
          }
        }
      })

      return () => {
        hls.destroy()
        hlsRef.current = null
      }
    }

    // Native HLS (Safari) or direct URL
    if (video.canPlayType('application/vnd.apple.mpegurl') || !src.includes('.m3u8')) {
      video.src = src
      const onLoad = () => setLoading(false)
      const onError = () => setError('Không thể phát video.')
      video.addEventListener('loadeddata', onLoad)
      video.addEventListener('error', onError)
      return () => {
        video.removeEventListener('loadeddata', onLoad)
        video.removeEventListener('error', onError)
      }
    }
  }, [src])

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-900 z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-accent-purple border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-400">Đang tải video...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-900/95 z-20">
          <div className="text-center px-6">
            <div className="text-4xl mb-3">!</div>
            <p className="text-gray-300 text-sm mb-3">{error}</p>
            <button
              onClick={retry}
              className="px-5 py-2 bg-accent-purple hover:bg-accent-purple/80 text-white rounded-lg text-sm transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        poster={poster}
        controls
        playsInline
        className="w-full h-full"
      />
    </div>
  )
}

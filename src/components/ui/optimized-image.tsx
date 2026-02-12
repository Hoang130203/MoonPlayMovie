import { useState, useRef, useEffect } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  fallback?: string
}

/**
 * Image component with spinning loader placeholder, async decoding,
 * fade-in on load, and error fallback.
 * Use priority=true for above-fold images (hero banner).
 */
export function OptimizedImage({
  src,
  alt,
  className = '',
  priority = false,
  fallback = '/placeholder-movie.svg',
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Check if image is already cached (loaded before paint)
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true)
    }
  }, [])

  return (
    <>
      {/* Spinning loader shown while image loads */}
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-8 h-8 rounded-full border-2 border-transparent border-t-accent-purple border-r-accent-cyan animate-spin" />
        </div>
      )}
      <img
        ref={imgRef}
        src={error ? fallback : src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'low'}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  )
}

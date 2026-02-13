import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { WatchHistoryEntry } from '../../lib/watch-history-storage'
import { getHistory, clearHistory } from '../../lib/watch-history-storage'
import { buildImageUrl } from '../../services/api-client'

export function WatchHistorySection() {
  const [history, setHistory] = useState<WatchHistoryEntry[]>([])

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  const handleClearHistory = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử xem?')) {
      clearHistory()
      setHistory([])
    }
  }

  if (history.length === 0) return null

  return (
    <section className="mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white section-title-line">
          Xem gần đây
        </h2>
        <button
          onClick={handleClearHistory}
          className="px-3 py-1.5 text-sm glass hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-all duration-300"
        >
          Xóa lịch sử
        </button>
      </div>

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-dark-700">
          {history.map((item) => (
            <Link
              key={`${item.slug}-${item.episode_slug}`}
              to={`/xem-phim/${item.slug}?tap=${item.episode_slug}`}
              className="group flex-shrink-0 w-48 glass rounded-xl overflow-hidden movie-card-hover"
            >
              <div className="relative aspect-[2/3] overflow-hidden bg-dark-700">
                <img
                  src={buildImageUrl(item.thumb_url)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-accent-purple text-white text-xs font-bold rounded-md shadow-lg">
                    Tiếp tục xem
                  </span>
                </div>
              </div>

              <div className="p-3">
                <h3 className="text-sm font-semibold text-white line-clamp-2 mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-1">
                  {item.origin_name}
                </p>
                <p className="text-xs text-accent-purple mt-1 font-medium">
                  Tập {item.episode_name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

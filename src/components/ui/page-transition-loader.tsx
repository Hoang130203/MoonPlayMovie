import { useEffect, useState, useSyncExternalStore } from 'react'
import { useLocation } from 'react-router-dom'
import { showLoader, hideLoader, subscribeLoader, getLoaderState } from '../../lib/page-loader-state'



function useLoaderActive() {
  return useSyncExternalStore(subscribeLoader, getLoaderState)
}

// ────────────── Top progress bar ──────────────
function TopProgressBar({ active }: { active: boolean }) {
  const [width, setWidth] = useState(0)
  const [prevActive, setPrevActive] = useState(active)

  // Reset width when active changes (React-recommended pattern)
  if (prevActive !== active) {
    setPrevActive(active)
    setWidth(active ? 0 : 100)
  }

  useEffect(() => {
    if (active) {
      const t1 = setTimeout(() => setWidth(30), 50)
      const t2 = setTimeout(() => setWidth(60), 400)
      const t3 = setTimeout(() => setWidth(80), 900)
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    }
    const t = setTimeout(() => setWidth(0), 300)
    return () => clearTimeout(t)
  }, [active])

  if (width === 0 && !active) return null

  return (
    <div className="page-progress-bar-track">
      <div className="page-progress-bar" style={{ width: `${width}%` }} />
    </div>
  )
}

// ────────────── Spinner overlay ──────────────
function SpinnerOverlay() {
  return (
    <div className="page-loader-overlay">
      <div className="page-loader-spinner-wrapper">
        <div className="page-loader-ring" />
        <div className="page-loader-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <p className="page-loader-text">Đang tải...</p>
    </div>
  )
}

// ────────────── Main component ──────────────
export function PageTransitionLoader() {
  const active = useLoaderActive()
  return (
    <>
      <TopProgressBar active={active} />
      {active && <SpinnerOverlay />}
    </>
  )
}

// ────────────── Route change auto-detector ──────────────
export function RouteChangeLoader() {
  const location = useLocation()
  const currentPath = location.pathname + location.search

  const [prevPath, setPrevPath] = useState(currentPath)
  if (prevPath !== currentPath) {
    setPrevPath(currentPath)
    showLoader()
    setTimeout(() => hideLoader(), 500)
  }

  return null
}

// Global imperative loader state (shared between components)
type Listener = (loading: boolean) => void
const listeners = new Set<Listener>()
let isLoading = false
let autoHideTimer: ReturnType<typeof setTimeout> | null = null

export function showLoader() {
  isLoading = true
  if (autoHideTimer) clearTimeout(autoHideTimer)
  autoHideTimer = setTimeout(() => hideLoader(), 3000)
  listeners.forEach((l) => l(true))
}

export function hideLoader() {
  isLoading = false
  if (autoHideTimer) { clearTimeout(autoHideTimer); autoHideTimer = null }
  listeners.forEach((l) => l(false))
}

export function subscribeLoader(fn: Listener) {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

export function getLoaderState() { return isLoading }

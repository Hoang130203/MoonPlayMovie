import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Phim bộ', path: '/danh-muc/phim-bo' },
  { label: 'Phim lẻ', path: '/danh-muc/phim-le' },
  { label: 'Hoạt hình', path: '/danh-muc/hoat-hinh' },
  { label: 'TV Shows', path: '/danh-muc/tv-shows' },
]

export function SiteHeader() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  const [prevPath, setPrevPath] = useState(location.pathname)
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname)
    setMobileMenuOpen(false)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (trimmed.length >= 2) {
      navigate(`/tim-kiem?q=${encodeURIComponent(trimmed)}`)
      setShowSearch(false)
      setSearchQuery('')
    }
  }

  function toggleSearch() {
    setShowSearch(!showSearch)
    if (!showSearch) setTimeout(() => searchInputRef.current?.focus(), 100)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-dark-900/90 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5'
          : 'bg-gradient-to-b from-dark-900/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <span className="text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
            🌙
          </span>
          <span className="text-xl font-bold text-white tracking-tight">
            Moon<span className="gradient-text-purple">Play</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-white nav-link-active'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Search + mobile toggle */}
        <div className="flex items-center gap-2">
          {/* Search bar (desktop) */}
          <div className={`hidden md:block transition-all duration-400 ease-out ${showSearch ? 'w-64 opacity-100' : 'w-0 opacity-0'} overflow-hidden`}>
            <form onSubmit={handleSearch}>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm phim..."
                className="w-full px-4 py-1.5 bg-dark-700/80 border border-dark-500 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none search-glow transition-all duration-300"
              />
            </form>
          </div>

          <button
            onClick={toggleSearch}
            className="hidden md:flex w-9 h-9 items-center justify-center rounded-xl hover:bg-white/10 transition-all duration-300 text-gray-400 hover:text-white hover:shadow-lg hover:shadow-purple-500/10"
            aria-label="Tìm kiếm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300"
            aria-label="Menu"
          >
            <svg className="w-5 h-5 transition-transform duration-300" style={{ transform: mobileMenuOpen ? 'rotate(90deg)' : 'rotate(0)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu with slide animation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-white/5 animate-slide-down">
          <div className="px-4 py-3">
            <form onSubmit={handleSearch} className="mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm phim..."
                className="w-full px-4 py-2.5 bg-dark-700/80 border border-dark-500 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none search-glow transition-all duration-300"
              />
            </form>
            <div className="stagger-children">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'text-white bg-accent-purple/15 border border-accent-purple/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

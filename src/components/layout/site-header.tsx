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

  // Close mobile menu on route change (React-recommended pattern)
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-900/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-dark-900/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🌙</span>
          <span className="text-xl font-bold text-white tracking-tight">
            Moon<span className="text-accent-purple">Play</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'text-accent-purple bg-accent-purple/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search + mobile toggle */}
        <div className="flex items-center gap-2">
          {/* Search bar (desktop) */}
          <div className={`hidden md:block transition-all duration-300 ${showSearch ? 'w-64' : 'w-0'} overflow-hidden`}>
            <form onSubmit={handleSearch}>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm phim..."
                className="w-full px-4 py-1.5 bg-dark-700 border border-dark-500 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-purple"
              />
            </form>
          </div>

          <button
            onClick={toggleSearch}
            className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-gray-300"
            aria-label="Tìm kiếm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-300"
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-800/95 backdrop-blur-md border-t border-dark-600">
          <div className="px-4 py-3">
            <form onSubmit={handleSearch} className="mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm phim..."
                className="w-full px-4 py-2.5 bg-dark-700 border border-dark-500 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-purple"
              />
            </form>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-accent-purple bg-accent-purple/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

import { Link } from 'react-router-dom'

const FOOTER_LINKS = [
  {
    title: 'Danh mục',
    links: [
      { label: 'Phim bộ', path: '/danh-muc/phim-bo' },
      { label: 'Phim lẻ', path: '/danh-muc/phim-le' },
      { label: 'Hoạt hình', path: '/danh-muc/hoat-hinh' },
      { label: 'TV Shows', path: '/danh-muc/tv-shows' },
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      { label: 'Giới thiệu', path: '/' },
      { label: 'Liên hệ', path: '/' },
      { label: 'Điều khoản', path: '/' },
      { label: 'Chính sách', path: '/' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-dark-800 border-t border-dark-600 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌙</span>
              <span className="text-xl font-bold text-white">
                Moon<span className="text-accent-purple">Play</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              MoonPlay là dịch vụ xem phim trực tuyến hàng đầu với hàng ngàn bộ phim đa dạng và chất lượng cao.
            </p>
          </div>

          {/* Links */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h4 className="text-white font-semibold mb-3">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-accent-purple-light text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dark-600 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 MoonPlay. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['facebook', 'youtube', 'instagram', 'tiktok'].map((social) => (
              <a
                key={social}
                href="#"
                className="w-9 h-9 rounded-full bg-dark-600 hover:bg-accent-purple/20 flex items-center justify-center transition-colors text-gray-400 hover:text-accent-purple-light"
                aria-label={social}
              >
                <SocialIcon name={social} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ name }: { name: string }) {
  const iconMap: Record<string, string> = {
    facebook: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
    youtube: 'M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z',
    instagram: 'M16 8a6 6 0 10-4 5.65M12 2a10 10 0 100 20 10 10 0 000-20z',
    tiktok: 'M9 12a4 4 0 104 4V4a5 5 0 005 5',
  }
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={iconMap[name] || ''} />
    </svg>
  )
}

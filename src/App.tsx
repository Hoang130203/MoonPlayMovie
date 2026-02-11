import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MainLayout } from './components/layout/main-layout'
import { Skeleton } from './components/ui/loading-skeleton'

// Lazy-load pages for code-splitting
const HomePage = lazy(() => import('./pages/home-page').then(m => ({ default: m.HomePage })))
const MovieDetailPage = lazy(() => import('./pages/movie-detail-page').then(m => ({ default: m.MovieDetailPage })))
const MoviePlayerPage = lazy(() => import('./pages/movie-player-page').then(m => ({ default: m.MoviePlayerPage })))
const BrowseByCategoryPage = lazy(() => import('./pages/browse-by-category-page').then(m => ({ default: m.BrowseByCategoryPage })))
const SearchResultsPage = lazy(() => import('./pages/search-results-page').then(m => ({ default: m.SearchResultsPage })))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

function PageLoader() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Skeleton className="w-full h-64 rounded-xl mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
        ))}
      </div>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/phim/:slug" element={<MovieDetailPage />} />
              <Route path="/xem-phim/:slug" element={<MoviePlayerPage />} />
              <Route path="/danh-muc/:slug" element={<BrowseByCategoryPage />} />
              <Route path="/tim-kiem" element={<SearchResultsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-6xl mb-4">404</div>
      <h1 className="text-2xl font-bold text-white mb-2">Trang không tồn tại</h1>
      <p className="text-gray-400 mb-6">Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      <a
        href="/"
        className="px-6 py-2.5 bg-accent-purple hover:bg-accent-purple/80 text-white rounded-lg font-medium transition-colors"
      >
        Về trang chủ
      </a>
    </div>
  )
}

export default App

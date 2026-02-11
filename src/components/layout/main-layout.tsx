import { Outlet } from 'react-router-dom'
import { SiteHeader } from './site-header'
import { SiteFooter } from './site-footer'

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}

import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-10">
        <div className="flex items-center justify-between h-full px-4 max-w-md mx-auto">
          <h1 className="text-lg font-semibold">My Time Logger</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14 pb-16 min-h-screen">
        <div className="max-w-md mx-auto p-4">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}

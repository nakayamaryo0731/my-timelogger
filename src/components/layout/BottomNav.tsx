import { NavLink } from 'react-router-dom'
import { Home, ClipboardList, BarChart3, Tags } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'ホーム' },
  { to: '/history', icon: ClipboardList, label: '履歴' },
  { to: '/stats', icon: BarChart3, label: '統計' },
  { to: '/tags', icon: Tags, label: 'タグ' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border">
      <div className="flex h-full max-w-md mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 text-xs transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

import {
  BookMarked,
  CircleDollarSign,
  Goal,
  LayoutDashboard,
  ListTodo,
  Lock,
  LogOut,
  Plus,
  Sparkles,
  Brain,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SidebarLink } from './SidebarLink'

const topLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/thoughts', label: 'Thoughts', icon: Brain },
  { to: '/goals', label: 'Goals', icon: Goal },
  { to: '/todos', label: 'Todo List', icon: ListTodo },
  { to: '/bookmarks', label: 'Bookmarks', icon: BookMarked },
  { to: '/passwords', label: 'Passwords', icon: Lock },
  { to: '/income', label: 'Income', icon: CircleDollarSign },
] as const

export function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="z-10 border-b border-outline-variant bg-surface-container-low px-4 py-5 lg:sticky lg:top-0 lg:h-screen lg:rounded-r-4xl lg:border-b-0 lg:px-5 lg:py-8">
      <div className="mb-6 px-2">
        <p className="font-display text-2xl font-black tracking-tight text-primary">Mybase</p>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
          Personal Sanctuary
        </p>
      </div>

      <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
        {topLinks.map((link) => (
          <SidebarLink key={link.to} to={link.to} label={link.label} icon={link.icon} />
        ))}
      </nav>

      <div className="mt-6 hidden lg:block">
        <button
          type="button"
          onClick={() => navigate('/thoughts')}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-on-primary transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <Plus size={16} />
          <span>New Entry</span>
        </button>

        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={() => navigate('/goals')}
            className="inline-flex w-full items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high"
          >
            <Sparkles size={14} />
            <span>Support</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex w-full items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
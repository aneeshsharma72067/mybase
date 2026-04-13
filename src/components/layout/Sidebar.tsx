import {
  BookMarked,
  CircleDollarSign,
  Goal,
  HeartPulse,
  LayoutDashboard,
  ListTodo,
  Lock,
  Brain,
  Settings,
} from 'lucide-react'
import { SidebarLink } from './SidebarLink'
import Logo from '../../assets/logo.png'

const topLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/health', label: 'Health', icon: HeartPulse },
  { to: '/thoughts', label: 'Thoughts', icon: Brain },
  { to: '/goals', label: 'Goals', icon: Goal },
  { to: '/todos', label: 'Todo List', icon: ListTodo },
  { to: '/bookmarks', label: 'Bookmarks', icon: BookMarked },
  { to: '/passwords', label: 'Passwords', icon: Lock },
  { to: '/income', label: 'Income', icon: CircleDollarSign },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const

export function Sidebar() {
  function openDailyCheckIn() {
    window.dispatchEvent(new CustomEvent('mybase:health-open-check-in'))
  }

  return (
    <aside className="z-10 border-b border-outline-variant/50 bg-surface-container-low px-4 py-5 lg:sticky lg:top-0 lg:h-screen lg:rounded-r-[2.5rem] lg:border-b-0 lg:px-5 lg:py-8">
      <div className="mb-6 px-2">
        <div className='flex items-center gap-2 mb-1'>
          <img src={Logo} className='w-10' alt="Mybase Logo" />
          <p className="font-display text-2xl font-black tracking-tight text-primary">Mybase</p>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
          Personal Sanctuary
        </p>
      </div>

      <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
        {topLinks.map((link) => (
          <SidebarLink key={link.to} to={link.to} label={link.label} icon={link.icon} />
        ))}
      </nav>

      <div className="mt-6 px-1">
        <button
          type="button"
          onClick={openDailyCheckIn}
          className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:opacity-95"
        >
          Daily Check-in
        </button>
      </div>
    </aside>
  )
}
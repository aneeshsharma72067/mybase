import { useEffect } from 'react'
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
  X,
} from 'lucide-react'
import { useLocation } from 'react-router-dom'
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

interface SidebarProps {
  onOpenCheckIn: () => void
  /** Whether the mobile off-canvas drawer is open. Ignored at lg+ (always visible). */
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ onOpenCheckIn, isOpen, onClose }: SidebarProps) {
  const location = useLocation()

  // Close the mobile drawer whenever the route changes (link tapped).
  useEffect(() => {
    onClose()
  }, [location.pathname, onClose])

  // Escape closes the drawer on mobile.
  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <>
      {/* Backdrop — mobile only, shown when the drawer is open. */}
      {isOpen ? (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-30 flex w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-outline-variant/50 bg-surface-container-low px-5 py-8 transition-transform duration-200 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:static lg:z-auto lg:h-screen lg:w-72 lg:max-w-none lg:translate-x-0 lg:rounded-r-[2.5rem] lg:border-r lg:transition-none',
        ].join(' ')}
      >
        <div className="mb-6 flex items-start justify-between px-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <img src={Logo} className="w-10" alt="Mybase Logo" />
              <p className="font-display text-2xl font-black tracking-tight text-primary">Mybase</p>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
              Personal Sanctuary
            </p>
          </div>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
            className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="grid grid-cols-1 gap-2">
          {topLinks.map((link) => (
            <SidebarLink key={link.to} to={link.to} label={link.label} icon={link.icon} />
          ))}
        </nav>

        <div className="mt-6 px-1">
          <button
            type="button"
            onClick={onOpenCheckIn}
            className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:opacity-95"
          >
            Daily Check-in
          </button>
        </div>
      </aside>
    </>
  )
}

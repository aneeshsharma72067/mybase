import {
  BookMarked,
  CircleDollarSign,
  Goal,
  LayoutDashboard,
  ListTodo,
  Lock,
  Brain,
} from 'lucide-react'
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

   
    </aside>
  )
}
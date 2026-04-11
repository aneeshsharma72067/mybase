import { NavLink } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

interface SidebarLinkProps {
  to: string
  label: string
  icon: LucideIcon
}

export function SidebarLink({ to, label, icon: Icon }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition-colors',
          isActive
            ? 'bg-primary-container text-primary'
            : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
        ].join(' ')
      }
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-low text-xs font-bold">
        <Icon size={16} />
      </span>
      <span>{label}</span>
    </NavLink>
  )
}
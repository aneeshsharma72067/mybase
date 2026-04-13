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
          'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all',
          isActive
            ? 'border-r-4 border-primary bg-primary/8 text-primary shadow-[0_10px_24px_rgba(0,109,63,0.06)]'
            : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface',
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
import { Menu } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import Logo from '../../assets/logo.png'

interface MainAreaProps {
  onOpenNav: () => void
}

export function MainArea({ onOpenNav }: MainAreaProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile top bar — hidden at lg+ where the sidebar is always visible. */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-outline-variant/50 bg-surface-container-low/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={onOpenNav}
          className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <img src={Logo} className="w-7" alt="" />
          <span className="font-display text-lg font-black tracking-tight text-primary">Mybase</span>
        </div>
      </header>

      <main className="flex-1 p-4 lg:p-10">
        <Outlet />
      </main>
    </div>
  )
}

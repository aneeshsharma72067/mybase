import { Bell, Search, UserCircle2 } from 'lucide-react'

interface HealthHeaderProps {
  query: string
  onQueryChange: (value: string) => void
}

export function HealthHeader({ query, onQueryChange }: HealthHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 lg:mb-10">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tighter text-on-surface lg:text-4xl">Health</h1>
        <p className="mt-1 text-sm font-medium text-on-surface-variant lg:text-base">Build calm momentum with daily signals from your body and mind.</p>
      </div>

      <div className="flex items-center gap-3">
        <label className="relative hidden sm:block">
          <span className="sr-only">Search health cards</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="w-64 rounded-full border border-outline-variant/30 bg-surface-container-highest px-4 py-2.5 pl-10 text-sm text-on-surface outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20"
            placeholder="Search health cards..."
            type="search"
          />
          <Search size={16} className="pointer-events-none absolute left-3 top-3 text-on-surface-variant" />
        </label>
        <button
          type="button"
          aria-label="Open notifications"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition hover:bg-surface-container"
        >
          <Bell size={16} />
        </button>
        <button
          type="button"
          aria-label="Open profile"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition hover:bg-surface-container"
        >
          <UserCircle2 size={16} />
        </button>
      </div>
    </header>
  )
}

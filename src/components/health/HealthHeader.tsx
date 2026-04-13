import { Search } from 'lucide-react'

interface HealthHeaderProps {
  query: string
  onQueryChange: (value: string) => void
}

export function HealthHeader({ query, onQueryChange }: HealthHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-black tracking-tight text-primary lg:text-5xl">Health</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Build calm momentum with daily signals from your body and mind.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 rounded-full bg-surface-container-lowest px-3 py-2 text-on-surface-variant shadow-sm">
          <Search size={15} />
          <span className="sr-only">Search health cards</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="w-44 bg-transparent text-sm text-on-surface outline-none lg:w-64"
            placeholder="Search health cards..."
            type="search"
          />
        </label>
      </div>
    </header>
  )
}

import { Grid2x2, LayoutList, Plus, Search, Settings2 } from 'lucide-react'

interface BookmarksHeaderProps {
  searchValue: string
  onSearchValueChange: (value: string) => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  onCreateBookmark: () => void
  onOpenSettings: () => void
}

export function BookmarksHeader({
  searchValue,
  onSearchValueChange,
  viewMode,
  onViewModeChange,
  onCreateBookmark,
  onOpenSettings,
}: BookmarksHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-black tracking-tight text-primary lg:text-5xl">Bookmarks</h1>
        <p className="mt-1 text-sm text-on-surface-variant">A calm collection of research, references, and design inspiration.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 rounded-full bg-surface-container-lowest px-3 py-2 text-on-surface-variant shadow-sm">
          <Search size={15} />
          <input
            value={searchValue}
            onChange={(event) => onSearchValueChange(event.target.value)}
            placeholder="Search saved items..."
            className="w-44 bg-transparent text-sm outline-none lg:w-64"
          />
        </label>

        <button
          type="button"
          onClick={onOpenSettings}
          className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-2 text-xs font-semibold hover:bg-surface-container"
        >
          <Settings2 size={14} />
          <span>Settings</span>
        </button>
        <div className="relative hidden items-center rounded-full border border-outline-variant/20 bg-surface-container-lowest p-1 md:flex">
          <span
            aria-hidden="true"
            className={[
              'absolute left-1 top-1 h-9 w-9 rounded-full bg-primary transition-transform duration-300 ease-out',
              viewMode === 'grid' ? 'translate-x-0' : 'translate-x-9',
            ].join(' ')}
          />
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={[
              'relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300',
              viewMode === 'grid' ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface',
            ].join(' ')}
            aria-label="Grid view"
          >
            <Grid2x2 size={15} />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={[
              'relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300',
              viewMode === 'list' ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface',
            ].join(' ')}
            aria-label="List view"
          >
            <LayoutList size={15} />
          </button>
        </div>

        <button
          type="button"
          onClick={onCreateBookmark}
          className="ml-2 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-on-primary hover:bg-primary-dim"
        >
          <Plus size={14} />
          <span>New Entry</span>
        </button>
      </div>
    </header>
  )
}
import { Bell, Grid2x2, LayoutList, Search, Settings2, UserCircle2 } from 'lucide-react'

interface GoalsHeaderProps {
  searchValue: string
  onSearchValueChange: (value: string) => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  onOpenSettings: () => void
  onOpenArchive: () => void
  onOpenNotifications: () => void
  statusText: string
}

export function GoalsHeader({
  searchValue,
  onSearchValueChange,
  viewMode,
  onViewModeChange,
  onOpenSettings,
  onOpenArchive,
  onOpenNotifications,
  statusText,
}: GoalsHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-black tracking-tight text-primary lg:text-5xl">Goals</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Track ambitions, milestones, and consistent progress.</p>
        <p className="mt-3 inline-flex rounded-full bg-surface-container-low px-3 py-1 text-xs font-semibold text-on-surface-variant">
          {statusText}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 rounded-full bg-surface-container-lowest px-3 py-2 text-on-surface-variant shadow-sm">
          <Search size={15} />
          <input
            value={searchValue}
            onChange={(event) => onSearchValueChange(event.target.value)}
            placeholder="Search milestones..."
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
        <button
          type="button"
          onClick={onOpenArchive}
          className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-2 text-xs font-semibold hover:bg-surface-container"
        >
          Archive
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
          onClick={onOpenNotifications}
          aria-label="Open notifications"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container"
        >
          <Bell size={15} />
        </button>
        <button
          type="button"
          aria-label="Open profile"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container"
        >
          <UserCircle2 size={16} />
        </button>
      </div>
    </header>
  )
}
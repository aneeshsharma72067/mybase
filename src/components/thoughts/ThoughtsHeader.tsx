import { Bell, Search, Settings2, UserCircle2 } from 'lucide-react'

interface ThoughtsHeaderProps {
  searchValue: string
  onSearchValueChange: (value: string) => void
  onOpenArchive: () => void
  onOpenSettings: () => void
  onOpenNotifications: () => void
  statusText: string
}

export function ThoughtsHeader({
  searchValue,
  onSearchValueChange,
  onOpenArchive,
  onOpenSettings,
  onOpenNotifications,
  statusText,
}: ThoughtsHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-black tracking-tight text-primary lg:text-5xl">Thoughts</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Capture, revisit, and shape your internal narrative.</p>
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
            placeholder="Search entries..."
            className="w-44 bg-transparent text-sm outline-none lg:w-64"
          />
        </label>

        <button
          type="button"
          onClick={onOpenArchive}
          className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-2 text-xs font-semibold hover:bg-surface-container"
        >
          Archive
        </button>
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
          onClick={onOpenNotifications}
          aria-label="Open notifications"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container"
        >
          <Bell size={15} />
        </button>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container"
          aria-label="Open profile"
        >
          <UserCircle2 size={16} />
        </button>
      </div>
    </header>
  )
}
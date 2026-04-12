import { Bell, Plus, Search, Settings2, UserCircle2 } from 'lucide-react'

interface TodoHeaderProps {
  searchValue: string
  onSearchValueChange: (value: string) => void
  onOpenSettings: () => void
  onOpenArchive: () => void
  onOpenNotifications: () => void
  onOpenCreate: () => void
  statusText: string
  archiveActive: boolean
}

export function TodoHeader({
  searchValue,
  onSearchValueChange,
  onOpenSettings,
  onOpenArchive,
  onOpenNotifications,
  onOpenCreate,
  statusText,
  archiveActive,
}: TodoHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-black tracking-tight text-primary lg:text-5xl">Todo List</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Stay grounded by shipping one focused task at a time.</p>
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
            placeholder="Search tasks..."
            className="w-40 bg-transparent text-sm outline-none lg:w-64"
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
          className={[
            'inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold',
            archiveActive
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-low hover:bg-surface-container',
          ].join(' ')}
        >
          {archiveActive ? 'Archive On' : 'Archive'}
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

        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-on-primary hover:bg-primary-dim"
        >
          <Plus size={14} />
          <span>Add New</span>
        </button>
      </div>
    </header>
  )
}
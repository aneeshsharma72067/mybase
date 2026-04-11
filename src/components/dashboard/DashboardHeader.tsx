import { Bell, FolderArchive, Settings2 } from 'lucide-react'

interface DashboardHeaderProps {
  statusMessage: string
  onOpenSettings: () => void
  onOpenArchive: () => void
  onOpenNotifications: () => void
}

export function DashboardHeader({
  statusMessage,
  onOpenSettings,
  onOpenArchive,
  onOpenNotifications,
}: DashboardHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 lg:mb-10">
      <div>
        <h1 className="font-display text-3xl font-black tracking-tight text-primary lg:text-5xl">
          Good Morning, Alex
        </h1>
        <p className="mt-1 text-sm font-medium text-on-surface-variant lg:text-base">
          Today is a fresh canvas. Stay grounded.
        </p>
        <p className="mt-3 inline-flex rounded-full bg-surface-container-low px-3 py-1 text-xs font-semibold text-on-surface-variant">
          {statusMessage}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenSettings}
          className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container"
        >
          <Settings2 size={14} />
          <span>Settings</span>
        </button>
        <button
          type="button"
          onClick={onOpenArchive}
          className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container"
        >
          <FolderArchive size={14} />
          <span>Archive</span>
        </button>
        <button
          type="button"
          onClick={onOpenNotifications}
          aria-label="Open notifications"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container"
        >
          <Bell size={16} />
        </button>
      </div>
    </header>
  )
}
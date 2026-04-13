import { Settings2 } from 'lucide-react'

interface DashboardHeaderProps {
  displayName: string
  statusMessage: string
  onOpenSettings: () => void
}

export function DashboardHeader({
  displayName,
  statusMessage,
  onOpenSettings,
}: DashboardHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 lg:mb-10">
      <div>
        <h1 className="font-display text-3xl font-black tracking-tight text-primary lg:text-5xl">
          Good Morning, {displayName}
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
      </div>
    </header>
  )
}
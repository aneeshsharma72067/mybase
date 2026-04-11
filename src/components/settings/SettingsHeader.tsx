interface SettingsHeaderProps {
  statusText: string
}

export function SettingsHeader({ statusText }: SettingsHeaderProps) {
  return (
    <header className="mx-auto mb-10 w-full max-w-5xl">
      <h1 className="font-display text-3xl font-black tracking-tight text-primary lg:text-5xl">Settings</h1>
      <p className="mt-2 text-sm text-on-surface-variant">Manage your personal sanctuary preferences and security.</p>
      <p className="mt-4 inline-flex rounded-full bg-surface-container-low px-3 py-1 text-xs font-semibold text-on-surface-variant">
        {statusText}
      </p>
    </header>
  )
}

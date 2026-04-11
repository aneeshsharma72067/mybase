interface SettingsSwitchRowProps {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function SettingsSwitchRow({ title, description, checked, onChange }: SettingsSwitchRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-bold text-on-surface">{title}</p>
        <p className="text-sm text-on-surface-variant">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          checked ? 'bg-primary' : 'bg-surface-container-high',
        ].join(' ')}
      >
        <span
          className={[
            'inline-block h-5 w-5 rounded-full bg-white transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          ].join(' ')}
        />
      </button>
    </div>
  )
}

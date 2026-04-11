import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface SettingsSectionProps {
  title: string
  icon: LucideIcon
  tone: 'primary' | 'secondary' | 'tertiary' | 'error'
  children: ReactNode
}

export function SettingsSection({ title, icon: Icon, tone, children }: SettingsSectionProps) {
  const toneClass =
    tone === 'secondary'
      ? 'bg-secondary-container text-secondary'
      : tone === 'tertiary'
      ? 'bg-tertiary-container text-tertiary'
      : tone === 'error'
      ? 'bg-error-container/20 text-error'
      : 'bg-primary-container text-primary'

  return (
    <section className="settings-surface rounded-xl border border-outline-variant/30 bg-surface-container-low p-8">
      <div className="mb-8 flex items-center gap-4">
        <div className={[ 'rounded-xl p-3', toneClass ].join(' ')}>
          <Icon size={20} />
        </div>
        <h2 className="font-display text-xl font-bold text-on-surface">{title}</h2>
      </div>
      {children}
    </section>
  )
}

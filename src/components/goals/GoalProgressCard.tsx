import type { LucideIcon } from 'lucide-react'

interface GoalProgressCardProps {
  icon: LucideIcon
  title: string
  description: string
  label: string
  value: string
  progress: number
  accent: 'primary' | 'secondary' | 'tertiary'
}

export function GoalProgressCard({
  icon: Icon,
  title,
  description,
  label,
  value,
  progress,
  accent,
}: GoalProgressCardProps) {
  const accentClass =
    accent === 'secondary'
      ? 'bg-secondary-container text-on-secondary-container'
      : accent === 'tertiary'
      ? 'bg-tertiary-container text-on-tertiary-container'
      : 'bg-primary-container text-on-primary-container'

  const barClass = accent === 'tertiary' ? 'bg-tertiary' : 'bg-primary'

  return (
    <article className="group flex h-80 flex-col justify-between rounded-xl bg-surface-container-lowest p-8 transition-shadow hover:shadow-xl hover:shadow-primary/5 lg:h-96">
      <div>
        <span className={[ 'mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg', accentClass ].join(' ')}>
          <Icon size={20} />
        </span>
        <h4 className="font-display text-2xl font-bold text-on-surface">{title}</h4>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{description}</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-on-surface">
          <span>{label}</span>
          <span>{value}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-surface-container">
          <div className={[ 'h-3 rounded-full', barClass ].join(' ')} style={{ width: `${progress}%` }} />
        </div>
      </div>
    </article>
  )
}
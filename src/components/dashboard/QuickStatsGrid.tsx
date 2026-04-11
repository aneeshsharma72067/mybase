import type { LucideIcon } from 'lucide-react'

interface QuickStat {
  label: string
  value: string
  tone: 'primary' | 'secondary' | 'tertiary' | 'error'
  icon: LucideIcon
}

interface QuickStatsGridProps {
  stats: QuickStat[]
}

function statToneClass(tone: QuickStat['tone']): string {
  if (tone === 'primary') {
    return 'text-primary'
  }

  if (tone === 'secondary') {
    return 'text-secondary'
  }

  if (tone === 'tertiary') {
    return 'text-tertiary'
  }

  return 'text-error'
}

export function QuickStatsGrid({ stats }: QuickStatsGridProps) {
  return (
    <section className="grid grid-cols-2 gap-3 rounded-xl bg-surface-container-lowest p-4">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className="rounded-lg bg-surface-container-low p-4 text-center"
        >
          <span className={[ 'mb-2 inline-flex', statToneClass(stat.tone) ].join(' ')}>
            <stat.icon size={16} />
          </span>
          <p className={['text-xl font-black', statToneClass(stat.tone)].join(' ')}>{stat.value}</p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">
            {stat.label}
          </p>
        </article>
      ))}
    </section>
  )
}
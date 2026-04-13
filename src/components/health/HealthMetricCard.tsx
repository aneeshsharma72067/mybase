import type { LucideIcon } from 'lucide-react'

interface HealthMetricCardProps {
  label: string
  value: string
  subtext: string
  icon: LucideIcon
  tone: 'primary' | 'secondary' | 'blue' | 'indigo' | 'tertiary'
}

const toneStyles: Record<HealthMetricCardProps['tone'], string> = {
  primary: 'text-primary bg-primary/10',
  secondary: 'text-secondary bg-secondary-container/35',
  blue: 'text-blue-500 bg-blue-50',
  indigo: 'text-indigo-500 bg-indigo-50',
  tertiary: 'text-tertiary bg-tertiary-container/25',
}

export function HealthMetricCard({ label, value, subtext, icon: Icon, tone }: HealthMetricCardProps) {
  return (
    <article className="rounded-[1.8rem] bg-surface-container-lowest p-5 shadow-[0_10px_24px_rgba(22,29,24,0.04)] ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1">
      <div className="mb-3 flex items-start justify-between gap-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">{label}</span>
        <span className={["inline-flex h-10 w-10 items-center justify-center rounded-full", toneStyles[tone]].join(' ')}>
          <Icon size={16} />
        </span>
      </div>
      <p className="font-display text-2xl font-black tracking-tight text-on-surface">{value}</p>
      <p className="mt-1 text-[10px] font-semibold text-on-surface-variant">{subtext}</p>
    </article>
  )
}

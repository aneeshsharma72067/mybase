import { useMemo } from 'react'

interface MomentumOverviewCardProps {
  momentum: { day: string; count: number }[]
  note: string
}

export function MomentumOverviewCard({ momentum, note }: MomentumOverviewCardProps) {
  const maxValue = useMemo(() => Math.max(...momentum.map((entry) => entry.count), 0), [momentum])

  return (
    <section className="col-span-12 flex h-72 flex-col rounded-xl bg-surface-container-high p-8 lg:col-span-4 lg:h-80 lg:p-10">
      <h3 className="font-display text-xl font-bold text-on-surface">Momentum Overview</h3>

      <div className="mt-8 flex h-full items-end gap-3">
        {momentum.map((entry) => {
          const barHeight = maxValue === 0 ? 18 : entry.count === 0 ? 18 : Math.max(18, (entry.count / maxValue) * 100)
          const trackTone = entry.count === 0 ? 'bg-primary/15' : 'bg-primary/20'
          const fillTone = entry.count === 0 ? 'bg-primary/20' : 'bg-primary'

          return (
            <div key={entry.day} className={['relative h-full flex-1 rounded-t-full', trackTone].join(' ')}>
              <div className="absolute inset-x-0 bottom-0 rounded-t-full" style={{ height: `${barHeight}%` }}>
                <div className={['h-full w-full rounded-t-full', fillTone].join(' ')} />
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-sm text-on-surface-variant">{note}</p>
    </section>
  )
}
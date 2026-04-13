interface SleepCyclesCardProps {
  entries: Array<{ day: string; hours: number }>
}

export function SleepCyclesCard({ entries }: SleepCyclesCardProps) {
  const maxHours = Math.max(...entries.map((entry) => entry.hours), 1)

  return (
    <section className="rounded-[2.25rem] flex-1 bg-surface-container-lowest p-8 shadow-[0_10px_24px_rgba(22,29,24,0.04)] ring-1 ring-black/5">
      <h2 className="font-display text-xl font-bold tracking-tight text-on-surface">Rest Cycles</h2>
      <p className="mt-1 text-sm text-on-surface-variant">Stability is progress.</p>

      <div className="mt-6 space-y-3">
        {entries.map((entry) => (
          <div key={entry.day} className="flex items-center gap-3">
            <span className="w-8 text-[10px] font-bold uppercase tracking-[0.14em] text-on-surface-variant">{entry.day}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-container-low">
              <div
                className="h-full rounded-full bg-secondary-container"
                style={{ width: `${Math.max(8, (entry.hours / maxHours) * 100)}%` }}
              />
            </div>
            <span className="w-12 text-right text-xs font-semibold text-on-surface">{entry.hours.toFixed(1)}h</span>
          </div>
        ))}
      </div>
    </section>
  )
}

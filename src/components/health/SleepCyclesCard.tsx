interface SleepCyclesCardProps {
  entries: Array<{ day: string; hours: number }>
  sleepGoal: number
}

export function SleepCyclesCard({ entries, sleepGoal }: SleepCyclesCardProps) {

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
                className={[
                  'h-full rounded-full',
                  entry.hours >= sleepGoal
                    ? 'bg-secondary-container'
                    : entry.hours >= sleepGoal * 0.75
                    ? 'bg-secondary-container/70'
                    : 'bg-amber-300',
                ].join(' ')}
                style={{ width: entry.hours > 0 ? `${Math.min((entry.hours / sleepGoal) * 100, 100)}%` : '8px' }}
              />
            </div>
            <span className="w-12 text-right text-xs font-semibold text-on-surface">{entry.hours > 0 ? `${entry.hours.toFixed(1)}h` : '—'}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

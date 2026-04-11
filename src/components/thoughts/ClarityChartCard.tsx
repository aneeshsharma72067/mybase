interface ClarityChartCardProps {
  mode: 'month' | 'year'
  onModeChange: (mode: 'month' | 'year') => void
}

const monthBars = [32, 48, 24, 56, 40, 60, 32]
const yearBars = [45, 52, 38, 62, 68, 74, 58]

export function ClarityChartCard({ mode, onModeChange }: ClarityChartCardProps) {
  return (
    <section className="rounded-xl bg-surface-container-low p-8 lg:p-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-3xl font-black text-on-surface">Cognitive Clarity</h3>
          <p className="text-sm text-on-surface-variant">Visualizing depth of recorded thoughts over time.</p>
        </div>

        <div className="relative inline-flex rounded-full bg-surface-container-lowest p-1 text-xs">
          <span
            className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-primary transition-transform duration-300 ease-out"
            style={{ transform: mode === 'month' ? 'translateX(0%)' : 'translateX(100%)' }}
          />
          <button
            type="button"
            onClick={() => onModeChange('month')}
            className={[
              'relative z-10 rounded-full px-5 py-2 font-bold transition-colors',
              mode === 'month' ? 'text-on-primary' : 'text-on-surface-variant hover:text-primary',
            ].join(' ')}
          >
            Month
          </button>
          <button
            type="button"
            onClick={() => onModeChange('year')}
            className={[
              'relative z-10 rounded-full px-5 py-2 font-bold transition-colors',
              mode === 'year' ? 'text-on-primary' : 'text-on-surface-variant hover:text-primary',
            ].join(' ')}
          >
            Year
          </button>
        </div>
      </div>

      <div className="relative h-56 overflow-hidden">
        <div
          className="flex h-full w-[200%] transition-transform duration-500 ease-out"
          style={{ transform: mode === 'month' ? 'translateX(0%)' : 'translateX(-50%)' }}
        >
          <div className="grid h-full w-1/2 grid-cols-7 items-end gap-3 pr-2">
            {monthBars.map((height, index) => (
              <div
                key={`month-${index}`}
                className={[
                  'rounded-t-xl transition-colors',
                  index === 5 ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-primary-container/45 hover:bg-primary-container',
                ].join(' ')}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>

          <div className="grid h-full w-1/2 grid-cols-7 items-end gap-3 pl-2">
            {yearBars.map((height, index) => (
              <div
                key={`year-${index}`}
                className={[
                  'rounded-t-xl transition-colors',
                  index === 5 ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-primary-container/45 hover:bg-primary-container',
                ].join(' ')}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
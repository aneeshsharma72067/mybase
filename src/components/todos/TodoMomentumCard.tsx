import type { TodoMomentumDay } from '../../store/useTodoStore'

interface TodoMomentumCardProps {
  days: TodoMomentumDay[]
  completionRate: number
  completedThisWeek: number
}

export function TodoMomentumCard({ days, completionRate, completedThisWeek }: TodoMomentumCardProps) {
  const maxCompleted = Math.max(1, ...days.map((day) => day.completed))

  return (
    <section className="relative h-130 overflow-hidden rounded-xl bg-linear-to-br from-primary to-primary-dim p-8 text-on-primary lg:h-150 lg:p-10">
      <div className="relative z-10">
        <span className="inline-block rounded-full bg-primary-container px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-on-primary-container">
          Productivity Pulse
        </span>
        <h3 className="mt-4 font-display text-4xl font-black leading-tight lg:text-5xl">Weekly Momentum</h3>

        <div className="mt-8 flex h-40 items-end gap-2">
          {days.map((day) => {
            const barHeight = Math.max(14, Math.round((day.completed / maxCompleted) * 100))

            return (
              <div key={day.dayLabel} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div
                  className={[
                    'w-full rounded-t-lg transition-colors',
                    day.completed === maxCompleted ? 'bg-on-primary' : 'bg-white/20 hover:bg-white/35',
                  ].join(' ')}
                  style={{ height: `${barHeight}%` }}
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">{day.dayLabel}</span>
              </div>
            )
          })}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div>
            <p className="font-display text-3xl font-black">{completionRate}%</p>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">Completion Rate</p>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl font-black">{completedThisWeek}</p>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">Completed This Week</p>
          </div>
        </div>
      </div>
    </section>
  )
}
interface TodoMomentumCardProps {
  bars: number[]
  flowIndex: number
  deepWorkHours: number
}

export function TodoMomentumCard({ bars, flowIndex, deepWorkHours }: TodoMomentumCardProps) {
  return (
    <section className="relative h-[520px] overflow-hidden rounded-xl bg-linear-to-br from-primary to-primary-dim p-8 text-on-primary lg:h-[600px] lg:p-10">
      <div className="relative z-10">
        <span className="inline-block rounded-full bg-primary-container px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-on-primary-container">
          Productivity Pulse
        </span>
        <h3 className="mt-4 font-display text-4xl font-black leading-tight lg:text-5xl">Weekly Momentum</h3>

        <div className="mt-8 flex h-40 items-end gap-2">
          {bars.map((bar, index) => (
            <div
              key={`${bar}-${index}`}
              className={[
                'flex-1 rounded-t-lg transition-colors',
                index === 4 ? 'bg-on-primary' : 'bg-white/20 hover:bg-white/35',
              ].join(' ')}
              style={{ height: `${bar}%` }}
            />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div>
            <p className="font-display text-3xl font-black">{flowIndex}%</p>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">Flow State Index</p>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl font-black">{deepWorkHours}</p>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">Deep Work Hours</p>
          </div>
        </div>
      </div>
    </section>
  )
}
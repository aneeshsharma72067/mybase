interface ActivityHeatmapCardProps {
  title: string
  subtitle: string
  imageUrl: string
  cells: { date: string; intensity: 0 | 1 | 2 | 3 | 4 }[]
  percentage: number
}

const intensityClasses: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'bg-on-primary/15',
  1: 'bg-[#9CECB8]',
  2: 'bg-[#75E5A1]',
  3: 'bg-[#40D282]',
  4: 'bg-primary-container',
}

export function ActivityHeatmapCard({ title, subtitle, imageUrl, cells, percentage }: ActivityHeatmapCardProps) {
  return (
    <section className="relative overflow-hidden rounded-[2.8rem] bg-primary p-8 text-on-primary shadow-[0_16px_32px_rgba(0,109,63,0.12)] lg:p-10">
      <img
        src={imageUrl}
        alt="Dense green forest with morning haze"
        className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-overlay"
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,109,63,0.92),rgba(8,188,113,0.82))]" />

      <div className="relative flex">
        <div className="flex-1">
          <h2 className="font-display text-3xl font-black tracking-tight leading-[0.95]">{title}</h2>
          <p className="mt-3 max-w-sm text-sm text-primary-fixed">{subtitle}</p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-on-primary/12 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]">
            <span className="h-2 w-2 rounded-full bg-primary-container" />
            Consistency: {percentage}%
          </p>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-7 gap-2">
            {cells.map((cell) => (
              <div
                key={cell.date}
                title={cell.date}
                aria-label={cell.date}
                data-intensity={cell.intensity}
                className={["aspect-square max-w-10 rounded-lg", intensityClasses[cell.intensity]].join(' ')}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-on-primary/70">
            <span>Less active</span>
            <span>Very active</span>
          </div>
        </div>
      </div>
    </section>
  )
}

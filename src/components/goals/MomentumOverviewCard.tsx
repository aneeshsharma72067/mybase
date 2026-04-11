interface MomentumOverviewCardProps {
  deltas: number[]
  note: string
}

export function MomentumOverviewCard({ deltas, note }: MomentumOverviewCardProps) {
  return (
    <section className="col-span-12 flex h-72 flex-col rounded-xl bg-surface-container-high p-8 lg:col-span-4 lg:h-80 lg:p-10">
      <h3 className="font-display text-xl font-bold text-on-surface">Momentum Overview</h3>

      <div className="mt-8 flex h-full items-end gap-3">
        {deltas.map((delta, index) => (
          <div key={`${delta}-${index}`} className="relative h-full flex-1 rounded-t-full bg-primary/20">
            <div className="absolute inset-x-0 bottom-0 rounded-t-full bg-primary" style={{ height: `${delta}%` }} />
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-on-surface-variant">
        {note}
      </p>
    </section>
  )
}
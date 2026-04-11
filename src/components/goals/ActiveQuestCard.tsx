interface ActiveQuestCardProps {
  title: string
  progress: number
  onDetails: () => void
}

export function ActiveQuestCard({ title, progress, onDetails }: ActiveQuestCardProps) {
  return (
    <section className="relative col-span-12 flex h-72 flex-col justify-between overflow-hidden rounded-xl bg-linear-to-br from-primary to-primary-dim p-8 text-on-primary lg:col-span-8 lg:h-80 lg:p-10">
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10">
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em]">
          Active Quest
        </span>
        <h2 className="mt-4 max-w-xl font-display text-3xl font-black leading-tight lg:text-5xl">{title}</h2>
      </div>

      <div className="relative z-10 flex items-end justify-between gap-4">
        <div className="w-full max-w-lg">
          <div className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-wider">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/20">
            <div className="h-3 rounded-full bg-on-primary" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <button
          type="button"
          onClick={onDetails}
          className="rounded-full bg-surface-container-lowest px-6 py-3 text-sm font-bold text-primary hover:bg-surface"
        >
          Details
        </button>
      </div>
    </section>
  )
}
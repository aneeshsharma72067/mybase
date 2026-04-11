interface GoalImageCardProps {
  title: string
  stage: string
  progress: number
  imageUrl: string
  category: string
}

export function GoalImageCard({ title, stage, progress, imageUrl, category }: GoalImageCardProps) {
  return (
    <article className="group relative h-80 overflow-hidden rounded-xl p-8 text-white lg:h-96">
      <img
        src={imageUrl}
        alt="Goal scenery"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

      <div className="relative z-10 mt-24 space-y-4 lg:mt-28">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-container">{category}</p>
        <h4 className="font-display text-2xl font-bold">{title}</h4>

        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-white/20">
            <div className="h-2 rounded-full bg-primary-container" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/80">{stage}</p>
        </div>
      </div>
    </article>
  )
}
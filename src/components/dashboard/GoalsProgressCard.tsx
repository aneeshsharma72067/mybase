import { ArrowRight } from 'lucide-react'

interface GoalProgress {
  name: string
  progress: number
}

interface GoalsProgressCardProps {
  goals: GoalProgress[]
  imageUrl: string
  onManageGoals: () => void
}

export function GoalsProgressCard({ goals, imageUrl, onManageGoals }: GoalsProgressCardProps) {
  return (
    <section className="relative overflow-hidden rounded-xl p-7">
      <img
        src={imageUrl}
        alt="Forest background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/75 to-primary/25" />

      <div className="relative z-10">
        <span className="inline-block rounded-full bg-primary-container px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-on-primary-container">
          Core Focus
        </span>

        <h3 className="mt-4 font-display text-3xl font-black text-on-primary">Quarterly Goals</h3>

        <div className="mt-6 space-y-4">
          {goals.map((goal) => (
            <article key={goal.name} className="space-y-2">
              <div className="flex justify-between text-sm font-bold text-on-primary">
                <span>{goal.name}</span>
                <span>{goal.progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/20">
                <div className="h-1.5 rounded-full bg-primary-container" style={{ width: `${goal.progress}%` }} />
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          onClick={onManageGoals}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-surface-container-lowest/20 px-4 py-2 text-sm font-semibold text-on-primary hover:bg-surface-container-lowest/30"
        >
          <span>Manage Goals</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </section>
  )
}
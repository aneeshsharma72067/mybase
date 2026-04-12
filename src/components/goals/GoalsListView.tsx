import { Leaf, PlusCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { GoalListRow } from './GoalListRow'

export interface GoalListItem {
  id: string
  icon: LucideIcon
  title: string
  category: string
  categoryTone: 'primary' | 'secondary' | 'tertiary'
  progress: number
  progressLabel: string
  deadline: string
  deadlineHint: string
  deadlineTone: 'primary' | 'error' | 'muted'
  status: string
  statusTone: 'primary' | 'secondary' | 'muted'
}

interface GoalsListViewProps {
  goals: GoalListItem[]
  onCreate: () => void
}

export function GoalsListView({ goals, onCreate }: GoalsListViewProps) {
  return (
    <section className="space-y-4">
      <div className="mb-2 flex items-center justify-between px-2 md:px-6">
        <h3 className="font-display text-2xl font-bold text-on-surface">Active Pursuits</h3>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-1 text-sm font-bold text-primary transition-colors hover:text-primary-dim"
        >
          <PlusCircle size={16} />
          <span>New Pursuit</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-lowest shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-225 w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-outline-variant/10 bg-surface-container-low/50 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="px-8 py-5">Goal Name</th>
                <th className="px-6 py-5">Category</th>
                <th className="w-72 px-6 py-5">Progress</th>
                <th className="px-6 py-5">Deadline</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5 text-right" aria-label="Actions" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {goals.map((goal) => (
                <GoalListRow key={goal.id} {...goal} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-4 bg-secondary px-5 py-4 text-on-secondary md:px-8 md:py-6">
          <div className="flex items-center gap-3 md:gap-4">
            <Leaf size={18} className="opacity-60" />
            <p className="text-xs italic md:text-sm">"Nature does not hurry, yet everything is accomplished." — Lao Tzu</p>
          </div>
          <button
            type="button"
            className="rounded-full border border-white/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors hover:bg-white/10 md:px-4"
          >
            Daily Reflection
          </button>
        </div>
      </div>
    </section>
  )
}

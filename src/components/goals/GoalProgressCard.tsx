import { Pin } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { KeyboardEvent } from 'react'
import { useGoalsStore, getGoalProgress } from '../../store/useGoalsStore'
import type { Goal } from '../../types/goal.types'

interface GoalProgressCardProps {
  goal: Goal
  icon: LucideIcon
  accent: 'primary' | 'secondary' | 'tertiary'
}

export function GoalProgressCard({ goal, icon: Icon, accent }: GoalProgressCardProps) {
  const pinGoal = useGoalsStore((state) => state.pinGoal)
  const setActiveGoal = useGoalsStore((state) => state.setActiveGoal)

  const progress = getGoalProgress(goal)
  const completedMilestones = goal.milestones.filter((milestone) => milestone.done).length
  const label = goal.type === 'numeric' ? 'Current' : 'Milestones'
  const value =
    goal.type === 'numeric'
      ? `${goal.current ?? 0}/${goal.target ?? 0}${goal.unit ? ` ${goal.unit}` : ''}`
      : `${completedMilestones}/${goal.milestones.length}`

  function openDetails() {
    setActiveGoal(goal.id)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openDetails()
    }
  }

  const accentClass =
    accent === 'secondary'
      ? 'bg-secondary-container text-on-secondary-container'
      : accent === 'tertiary'
      ? 'bg-tertiary-container text-on-tertiary-container'
      : 'bg-primary-container text-on-primary-container'

  const barClass = accent === 'tertiary' ? 'bg-tertiary' : 'bg-primary'

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={openDetails}
      onKeyDown={handleKeyDown}
      className="group relative flex h-80 cursor-pointer flex-col justify-between rounded-xl bg-surface-container-lowest p-8 text-left transition-shadow hover:shadow-xl hover:shadow-primary/5 lg:h-96"
      aria-label={`Open details for ${goal.title}`}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          pinGoal(goal.id)
        }}
        className={[
          'absolute right-5 top-5 inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors',
          goal.isFocused
            ? 'border-primary bg-primary-container text-primary'
            : 'border-outline-variant/20 bg-surface-container text-on-surface-variant hover:border-primary/30 hover:text-primary',
        ].join(' ')}
        aria-label={goal.isFocused ? 'Active Quest pinned' : 'Pin as Active Quest'}
        aria-pressed={goal.isFocused}
      >
        <Pin size={13} fill={goal.isFocused ? 'currentColor' : 'none'} />
      </button>

      <div>
        <span className={[ 'mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg', accentClass ].join(' ')}>
          <Icon size={20} />
        </span>
        <h4 className="font-display text-2xl font-bold text-on-surface">{goal.title}</h4>
        <p
          className="mt-3 overflow-hidden text-sm leading-relaxed text-on-surface-variant"
          style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}
        >
          {goal.description || 'No description added yet.'}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-on-surface">
          <span>{label}</span>
          <span>{value}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-surface-container">
          <div className={[ 'h-3 rounded-full', barClass ].join(' ')} style={{ width: `${progress}%` }} />
        </div>
      </div>
    </article>
  )
}
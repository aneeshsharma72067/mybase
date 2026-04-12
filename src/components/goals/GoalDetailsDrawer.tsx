import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { getGoalProgress, useGoalsStore } from '../../store/useGoalsStore'
import type { Goal } from '../../types/goal.types'

interface GoalDetailsDrawerProps {
  goal: Goal
}

function getStatusToneClass(status: Goal['status']): string {
  if (status === 'completed') {
    return 'bg-secondary-container text-on-secondary-container'
  }

  if (status === 'paused') {
    return 'bg-surface-container-high text-on-surface-variant'
  }

  if (status === 'archived') {
    return 'bg-surface-container text-on-surface-variant'
  }

  return 'bg-primary-container text-on-primary-container'
}

function getDeadlineToneClass(deadline?: string): string {
  if (!deadline) {
    return 'text-on-surface-variant'
  }

  const deadlineDate = new Date(deadline)
  const today = new Date()
  const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays <= 3) {
    return 'text-error'
  }

  if (diffDays <= 10) {
    return 'text-primary'
  }

  return 'text-on-surface-variant'
}

export function GoalDetailsDrawer({ goal }: GoalDetailsDrawerProps) {
  const activeGoalId = useGoalsStore((state) => state.activeGoalId)
  const setActiveGoal = useGoalsStore((state) => state.setActiveGoal)
  const toggleMilestone = useGoalsStore((state) => state.toggleMilestone)
  const updateGoal = useGoalsStore((state) => state.updateGoal)
  const logProgress = useGoalsStore((state) => state.logProgress)

  const [milestoneInput, setMilestoneInput] = useState('')
  const [progressValue, setProgressValue] = useState('')
  const [progressNote, setProgressNote] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)

  const isOpen = activeGoalId === goal.id
  const progress = getGoalProgress(goal)
  const recentLogs = useMemo(
    () =>
      [...goal.logs]
        .sort((left, right) => right.loggedAt.localeCompare(left.loggedAt))
        .slice(0, 5),
    [goal.logs],
  )

  function closeDrawer() {
    setActiveGoal(null)
  }

  function addMilestone() {
    const trimmedLabel = milestoneInput.trim()

    if (!trimmedLabel) {
      return
    }

    updateGoal(goal.id, {
      milestones: [
        ...goal.milestones,
        {
          id: uuidv4(),
          label: trimmedLabel,
          done: false,
        },
      ],
    })
    setMilestoneInput('')
  }

  function handleMilestoneKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      addMilestone()
    }
  }

  function submitProgress() {
    const parsedValue = Number(progressValue)

    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      return
    }

    logProgress(goal.id, parsedValue, progressNote.trim() || undefined)
    setProgressValue('')
    setProgressNote('')
  }

  function handleProgressKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      submitProgress()
    }
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const panel = panelRef.current
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const focusables = Array.from(panel?.querySelectorAll<HTMLElement>(selector) ?? []).filter(
      (element) => !element.hasAttribute('disabled'),
    )

    focusables[0]?.focus()

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeDrawer()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const items = Array.from(panel?.querySelectorAll<HTMLElement>(selector) ?? []).filter(
        (element) => !element.hasAttribute('disabled'),
      )

      if (items.length === 0) {
        return
      }

      const first = items[0]
      const last = items[items.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    setMilestoneInput('')
    setProgressValue('')
    setProgressNote('')
  }, [goal.id])

  return (
    <div
      className="fixed inset-0 z-50"
      aria-modal="true"
      role="dialog"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeDrawer()
        }
      }}
    >
      <div
        className={[
          'absolute inset-0 bg-black/30 transition-opacity ease-out',
          isOpen ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        style={{ transitionDuration: isOpen ? '240ms' : '200ms' }}
      />

      <aside
        ref={panelRef}
        className={[
          'absolute right-0 top-0 flex h-full w-full max-w-105 flex-col overflow-y-auto border-l border-outline-variant/20 bg-surface-container-lowest p-6 shadow-2xl transition-[transform,opacity] ease-out md:p-8',
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        ].join(' ')}
        style={{ transitionDuration: isOpen ? '240ms' : '200ms' }}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl font-black text-on-surface">{goal.title}</h2>
              <span className={['rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]', getStatusToneClass(goal.status)].join(' ')}>
                {goal.status}
              </span>
            </div>
            {goal.category ? <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">{goal.category}</p> : null}
          </div>

          <button
            type="button"
            onClick={closeDrawer}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            aria-label="Close goal details"
          >
            <X size={16} />
          </button>
        </div>

        {goal.description ? <p className="text-sm leading-relaxed text-on-surface-variant">{goal.description}</p> : null}

        {goal.deadline ? (
          <p className={['mt-4 text-sm font-semibold', getDeadlineToneClass(goal.deadline)].join(' ')}>
            Due: {format(new Date(goal.deadline), 'MMM d, yyyy')}
          </p>
        ) : null}

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-surface-container">
            <div className="h-3 rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {goal.type === 'milestone' ? (
          <div className="mt-8 space-y-4">
            <div className="space-y-3">
              {goal.milestones.map((milestone) => (
                <label key={milestone.id} className="flex gap-3 rounded-xl bg-surface-container-lowest p-3">
                  <input
                    type="checkbox"
                    checked={milestone.done}
                    onChange={() => toggleMilestone(goal.id, milestone.id)}
                    className="mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className={['block text-sm font-semibold text-on-surface', milestone.done ? 'line-through opacity-60' : ''].join(' ')}>
                      {milestone.label}
                    </span>
                    {milestone.completedAt ? (
                      <span className="mt-1 block text-xs text-on-surface-variant">
                        Completed {format(new Date(milestone.completedAt), 'MMM d, yyyy')}
                      </span>
                    ) : null}
                  </div>
                </label>
              ))}
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={milestoneInput}
                onChange={(event) => setMilestoneInput(event.target.value)}
                onKeyDown={handleMilestoneKeyDown}
                placeholder="Add milestone"
                className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
              />
              <p className="text-xs text-on-surface-variant">Press Enter to add a milestone.</p>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            <div className="rounded-xl bg-surface-container-lowest p-4 text-sm font-semibold text-on-surface">
              {goal.current ?? 0} / {goal.target ?? 0} {goal.unit ?? ''}
            </div>

            <div className="grid gap-3 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_auto]">
              <input
                type="number"
                min="1"
                value={progressValue}
                onChange={(event) => setProgressValue(event.target.value)}
                onKeyDown={handleProgressKeyDown}
                placeholder="Value"
                className="rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
              />
              <input
                type="text"
                value={progressNote}
                onChange={(event) => setProgressNote(event.target.value)}
                onKeyDown={handleProgressKeyDown}
                placeholder="Optional note"
                className="rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
              />
              <button
                type="button"
                onClick={submitProgress}
                className="rounded-full bg-primary px-4 py-3 text-sm font-bold text-on-primary transition-colors hover:bg-primary-dim"
              >
                Log Progress
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">Recent Logs</h3>
          {recentLogs.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No activity logged yet.</p>
          ) : (
            <div className="space-y-2">
              {recentLogs.map((entry) => (
                <div key={entry.id} className="rounded-xl bg-surface-container-lowest p-3 text-sm text-on-surface">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-on-surface-variant">{format(new Date(entry.loggedAt), 'MMM d')}</span>
                    <span className="text-right font-semibold">{entry.note || String(entry.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

export default GoalDetailsDrawer

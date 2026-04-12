import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useGoalsStore } from '../../store/useGoalsStore'
import type { GoalType } from '../../types/goal.types'

interface AddGoalModalProps {
  isOpen: boolean
  onClose: () => void
}

const ANIMATION_MS = 220

function buildMilestoneState(count: number): string[] {
  return Array.from({ length: count }, () => '')
}

export function AddGoalModal({ isOpen, onClose }: AddGoalModalProps) {
  const addGoal = useGoalsStore((state) => state.addGoal)
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [goalType, setGoalType] = useState<GoalType>('milestone')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [milestoneInputs, setMilestoneInputs] = useState<string[]>(() => buildMilestoneState(3))
  const [target, setTarget] = useState('')
  const [unit, setUnit] = useState('')
  const [deadline, setDeadline] = useState('')
  const [category, setCategory] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const dialogRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)

  function resetForm() {
    setGoalType('milestone')
    setTitle('')
    setDescription('')
    setMilestoneInputs(buildMilestoneState(3))
    setTarget('')
    setUnit('')
    setDeadline('')
    setCategory('')
    setIsFocused(false)
  }

  function requestClose() {
    if (title.trim().length > 0 && !window.confirm('Discard this new goal?')) {
      return
    }

    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true)
      setIsVisible(false)
      const id = requestAnimationFrame(() => setIsVisible(true))
      return () => cancelAnimationFrame(id)
    }

    setIsVisible(false)
    const timeoutId = window.setTimeout(() => {
      setIsMounted(false)
      resetForm()
    }, ANIMATION_MS)

    return () => window.clearTimeout(timeoutId)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      titleRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const dialog = dialogRef.current
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        requestClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const items = Array.from(dialog?.querySelectorAll<HTMLElement>(selector) ?? []).filter(
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
  }, [isOpen, title])

  function addMilestoneField() {
    setMilestoneInputs((current) => [...current, ''])
  }

  function updateMilestoneField(index: number, value: string) {
    setMilestoneInputs((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)))
  }

  function saveGoal() {
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      return
    }

    addGoal({
      title: trimmedTitle,
      description: description.trim() || undefined,
      type: goalType,
      status: 'active',
      isFocused,
      milestones:
        goalType === 'milestone'
          ? milestoneInputs
              .map((item) => item.trim())
              .filter(Boolean)
              .map((label) => ({ label }))
          : [],
      target: goalType === 'numeric' ? Number(target) || 0 : undefined,
      current: goalType === 'numeric' ? 0 : undefined,
      unit: goalType === 'numeric' ? unit.trim() || undefined : undefined,
      deadline: deadline || undefined,
      category: category.trim() || undefined,
    })

    onClose()
  }

  if (!isMounted) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          requestClose()
        }
      }}
    >
      <div
        className={[
          'absolute inset-0 bg-black/40 transition-opacity ease-out',
          isVisible ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        style={{ transitionDuration: `${ANIMATION_MS}ms` }}
      />

      <div
        ref={dialogRef}
        className={[
          'relative z-10 w-full max-w-3xl rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-2xl transition-[opacity,transform] ease-out md:p-8',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0',
        ].join(' ')}
        style={{ transitionDuration: `${ANIMATION_MS}ms` }}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-on-surface">New Goal</h2>
          <button
            type="button"
            onClick={requestClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            aria-label="Close goal modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What do you want to achieve?"
            className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
          />

          <textarea
            rows={2}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe this goal..."
            className="w-full resize-none rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
          />

          <div className="flex flex-wrap gap-2 rounded-full bg-surface-container-lowest p-1 text-sm font-bold">
            <button
              type="button"
              onClick={() => setGoalType('milestone')}
              className={[
                'rounded-full px-4 py-2 transition-colors',
                goalType === 'milestone' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface',
              ].join(' ')}
            >
              Milestone-based
            </button>
            <button
              type="button"
              onClick={() => setGoalType('numeric')}
              className={[
                'rounded-full px-4 py-2 transition-colors',
                goalType === 'numeric' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface',
              ].join(' ')}
            >
              Numeric
            </button>
          </div>

          {goalType === 'milestone' ? (
            <div className="space-y-3">
              {milestoneInputs.map((value, index) => (
                <input
                  key={`${index}-${milestoneInputs.length}`}
                  type="text"
                  value={value}
                  onChange={(event) => updateMilestoneField(index, event.target.value)}
                  placeholder={`Milestone ${index + 1}`}
                  className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
                />
              ))}
              <button
                type="button"
                onClick={addMilestoneField}
                className="text-sm font-semibold text-primary hover:underline"
              >
                + Add milestone
              </button>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              <input
                type="number"
                min="1"
                value={target}
                onChange={(event) => setTarget(event.target.value)}
                placeholder="100"
                className="rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
              />
              <input
                type="text"
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
                placeholder="km / books / hours"
                className="rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
              />
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-2">
            <input
              type="date"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
              className="rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
            />
            <input
              type="text"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="health / career / personal..."
              className="rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
            />
          </div>

          <label className="flex items-center gap-3 rounded-xl bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface">
            <input
              type="checkbox"
              checked={isFocused}
              onChange={(event) => setIsFocused(event.target.checked)}
              className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-0"
            />
            <span>Set as Active Quest</span>
          </label>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-outline-variant/30 px-5 py-3 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveGoal}
              disabled={!title.trim()}
              className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-on-primary hover:bg-primary-dim disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save Goal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddGoalModal

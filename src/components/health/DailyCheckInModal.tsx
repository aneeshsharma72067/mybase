import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { format } from 'date-fns'
import { getTodayLog, useHealthStore } from '../../store/useHealthStore'

interface DailyCheckInModalProps {
  isOpen: boolean
  onClose: () => void
}

const ANIMATION_MS = 220

export function DailyCheckInModal({ isOpen, onClose }: DailyCheckInModalProps) {
  const logs = useHealthStore((state) => state.logs)
  const profile = useHealthStore((state) => state.profile)
  const upsertDailyLog = useHealthStore((state) => state.upsertDailyLog)

  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const [steps, setSteps] = useState('')
  const [weight, setWeight] = useState('')
  const [waterGlasses, setWaterGlasses] = useState('')
  const [sleepHours, setSleepHours] = useState('')
  const [energyLevel, setEnergyLevel] = useState<1 | 2 | 3 | 4 | 5 | undefined>(undefined)

  const dialogRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true)
      setIsVisible(false)
      const frame = requestAnimationFrame(() => setIsVisible(true))
      return () => cancelAnimationFrame(frame)
    }

    setIsVisible(false)

    const timeout = window.setTimeout(() => {
      setIsMounted(false)
    }, ANIMATION_MS)

    return () => window.clearTimeout(timeout)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const existing = getTodayLog(logs)

    setSteps(existing?.steps !== undefined ? String(existing.steps) : '')
    setWeight(existing?.weight !== undefined ? String(existing.weight) : '')
    setWaterGlasses(existing?.waterGlasses !== undefined ? String(existing.waterGlasses) : '')
    setSleepHours(existing?.sleepHours !== undefined ? String(existing.sleepHours) : '')
    setEnergyLevel(existing?.energyLevel)
  }, [isOpen, logs])

  useEffect(() => {
    if (isOpen) {
      firstInputRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const items = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(selector) ?? []).filter(
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
  }, [isOpen, onClose])

  function handleSave() {
    const parsedSteps = steps.trim() ? Number(steps) : undefined
    const parsedWeight = weight.trim() ? Number(weight) : undefined
    const parsedWater = waterGlasses.trim() ? Number(waterGlasses) : undefined
    const parsedSleep = sleepHours.trim() ? Number(sleepHours) : undefined

    const payload: {
      date: string
      steps?: number
      weight?: number
      waterGlasses?: number
      sleepHours?: number
      energyLevel?: 1 | 2 | 3 | 4 | 5
    } = { date: today }

    if (parsedSteps !== undefined && Number.isFinite(parsedSteps)) {
      payload.steps = parsedSteps
    }

    if (parsedWeight !== undefined && Number.isFinite(parsedWeight)) {
      payload.weight = parsedWeight
    }

    if (parsedWater !== undefined && Number.isFinite(parsedWater)) {
      payload.waterGlasses = parsedWater
    }

    if (parsedSleep !== undefined && Number.isFinite(parsedSleep)) {
      payload.sleepHours = parsedSleep
    }

    if (energyLevel !== undefined) {
      payload.energyLevel = energyLevel
    }

    upsertDailyLog(payload)
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
          onClose()
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
          'relative z-10 w-full max-w-xl rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-2xl transition-[opacity,transform] ease-out md:p-8',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        ].join(' ')}
        style={{ transitionDuration: `${ANIMATION_MS}ms` }}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-on-surface">Daily Check-in</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            aria-label="Close check-in modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-on-surface-variant">Steps</label>
            <div className="grid grid-cols-[1fr_auto] items-center gap-3">
              <input
                ref={firstInputRef}
                type="number"
                min={0}
                max={99999}
                value={steps}
                onChange={(event) => setSteps(event.target.value)}
                placeholder="How many steps today?"
                className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
              />
              <span className="text-xs font-semibold text-on-surface-variant">/ {profile.stepGoal.toLocaleString()} goal</span>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-on-surface-variant">Weight</label>
            <div className="grid grid-cols-[1fr_auto] items-center gap-3">
              <input
                type="number"
                min={0}
                step={0.1}
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                placeholder="Your weight"
                className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
              />
              <span className="text-xs font-semibold text-on-surface-variant">{profile.weightUnit}</span>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-on-surface-variant">Water glasses</label>
            <div className="grid grid-cols-[1fr_auto] items-center gap-3">
              <input
                type="number"
                min={0}
                max={20}
                value={waterGlasses}
                onChange={(event) => setWaterGlasses(event.target.value)}
                placeholder="Glasses of water"
                className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
              />
              <span className="text-xs font-semibold text-on-surface-variant">/ {profile.waterGoal} glasses</span>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-on-surface-variant">Sleep hours</label>
            <input
              type="number"
              min={0}
              max={24}
              step={0.5}
              value={sleepHours}
              onChange={(event) => setSleepHours(event.target.value)}
              placeholder="Hours of sleep last night"
              className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-on-surface-variant">Energy level</label>
            <div className="flex items-center gap-2">
              {[
                { emoji: '😴', value: 1 as const },
                { emoji: '😐', value: 2 as const },
                { emoji: '🙂', value: 3 as const },
                { emoji: '😊', value: 4 as const },
                { emoji: '⚡', value: 5 as const },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setEnergyLevel(item.value)}
                  className={[
                    'inline-flex h-10 w-10 items-center justify-center rounded-xl border text-lg transition',
                    energyLevel === item.value
                      ? 'border-primary bg-primary/10'
                      : 'border-outline-variant/40 bg-surface hover:border-primary/35',
                  ].join(' ')}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-surface-container px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:opacity-95"
          >
            Log Today
          </button>
        </div>
      </div>
    </div>
  )
}

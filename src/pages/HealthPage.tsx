import { Droplets, Footprints, HeartPulse, MoonStar, Scale, Zap } from 'lucide-react'
import { format } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { ActivityHeatmapCard } from '../components/health/ActivityHeatmapCard'
import { DailyCheckInModal } from '../components/health/DailyCheckInModal'
import { HealthHeader } from '../components/health/HealthHeader'
import { HealthMetricCard } from '../components/health/HealthMetricCard'
import { HydrationTrackerCard } from '../components/health/HydrationTrackerCard'
import { SleepCyclesCard } from '../components/health/SleepCyclesCard'
import {
  formatWaterLitres,
  getCurrentMonthTotalDays,
  getEnergyEmoji,
  getMonthlyConsistency,
  getSleepLastNDays,
  getTodayLog,
  getWeightDelta,
  getWeightHistory,
  getWeeklySteps,
  useHealthStore,
} from '../store/useHealthStore'

const forestImage = '/images/health/health-forest.jpg'

export function HealthPage() {
  const [query, setQuery] = useState('')
  const [monthRange, setMonthRange] = useState<1 | 3 | 999>(3)
  const [showCheckIn, setShowCheckIn] = useState(false)

  const logs = useHealthStore((state) => state.logs)
  const profile = useHealthStore((state) => state.profile)
  const addWaterGlass = useHealthStore((state) => state.addWaterGlass)
  const removeWaterGlass = useHealthStore((state) => state.removeWaterGlass)

  const todayLog = getTodayLog(logs)
  const todayDate = format(new Date(), 'yyyy-MM-dd')

  const weeklySteps = getWeeklySteps(logs)
  const maxStepsForBar = Math.max(...weeklySteps.map((entry) => entry.steps), 1)
  const stepsToday = todayLog?.steps ?? 0
  const stepsProgress = Math.min((stepsToday / profile.stepGoal) * 100, 100)
  const circleCircumference = 527.7
  const circleOffset = circleCircumference * (1 - stepsProgress / 100)

  const hydrationCount = todayLog?.waterGlasses ?? 0

  const sleepEntries = getSleepLastNDays(logs, 7)

  const weightDelta = getWeightDelta(logs, 7)
  const weightHistory = getWeightHistory(logs, monthRange)
  const monthLabels = useMemo(() => {
    const labels = new Set<string>()
    for (const item of weightHistory) {
      labels.add(format(new Date(item.date), 'MMM'))
    }
    return Array.from(labels)
  }, [weightHistory])

  const monthlyConsistency = getMonthlyConsistency(logs)
  const monthDays = getCurrentMonthTotalDays()
  const heatmapCells = useMemo(() => {
    const cells = [...monthlyConsistency.cells]

    for (let day = cells.length + 1; day <= monthDays; day += 1) {
      const date = format(new Date(new Date().getFullYear(), new Date().getMonth(), day), 'yyyy-MM-dd')
      cells.push({ date, intensity: 0 })
    }

    return cells
  }, [monthlyConsistency.cells, monthDays])

  const energyEmoji = getEnergyEmoji(todayLog?.energyLevel)

  useEffect(() => {
    function handleOpenCheckIn() {
      setShowCheckIn(true)
    }

    window.addEventListener('mybase:health-open-check-in', handleOpenCheckIn)
    return () => window.removeEventListener('mybase:health-open-check-in', handleOpenCheckIn)
  }, [])

  const metrics = [
    {
      id: 'steps',
      label: 'Steps',
      value: stepsToday > 0 ? `${(stepsToday / 1000).toFixed(1)}k` : '0',
      subtext: `Target: ${(profile.stepGoal / 1000).toFixed(0)}k`,
      icon: Footprints,
      tone: 'primary' as const,
    },
    {
      id: 'weight',
      label: 'Weight',
      value:
        todayLog?.weight !== undefined
          ? `${(profile.weightUnit === 'lbs' ? todayLog.weight * 2.20462 : todayLog.weight).toFixed(1)}${profile.weightUnit}`
          : '—',
      subtext:
        weightDelta === null
          ? 'No previous data'
          : weightDelta < 0
          ? `${weightDelta.toFixed(1)}kg vs last week`
          : weightDelta > 0
          ? `+${weightDelta.toFixed(1)}kg vs last week`
          : 'Same as last week',
      subtextClassName:
        weightDelta === null || weightDelta === 0
          ? 'text-on-surface-variant'
          : weightDelta < 0
          ? 'text-primary'
          : 'text-tertiary',
      icon: Scale,
      tone: 'secondary' as const,
    },
    {
      id: 'water',
      label: 'Water',
      value: `${hydrationCount}/${profile.waterGoal}`,
      subtext: `${formatWaterLitres(hydrationCount)} drank`,
      icon: Droplets,
      tone: 'blue' as const,
    },
    {
      id: 'sleep',
      label: 'Sleep',
      value: todayLog?.sleepHours !== undefined ? `${todayLog.sleepHours.toFixed(1)}h` : '—',
      subtext: `Goal: ${profile.sleepGoal}h`,
      icon: MoonStar,
      tone: 'indigo' as const,
    },
  ]

  const visibleMetricCards = (() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return metrics
    }

    return metrics.filter((card) => {
      const haystack = `${card.label} ${card.value} ${card.subtext}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  })()

  const showEnergy = !query.trim() || `energy ${energyEmoji}`.toLowerCase().includes(query.trim().toLowerCase())

  return (
    <div className="mx-auto w-full max-w-6xl">
      <HealthHeader query={query} onQueryChange={setQuery} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {visibleMetricCards.map((card) => (
          <HealthMetricCard
            key={card.id}
            label={card.label}
            value={card.value}
            subtext={card.subtext}
            icon={card.icon}
            tone={card.tone}
            subtextClassName={card.subtextClassName}
          />
        ))}

        {showEnergy ? (
          <article className="rounded-[1.8rem] bg-surface-container-lowest p-5 shadow-[0_10px_24px_rgba(22,29,24,0.04)] ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1">
            <div className="mb-3 flex items-start justify-between gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">Energy</span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-tertiary-container/25 text-tertiary">
                <Zap size={16} />
              </span>
            </div>
            <div className="flex h-14 items-center justify-center">
              <p className="text-4xl leading-none">{energyEmoji}</p>
            </div>
          </article>
        ) : null}
      </div>

      {visibleMetricCards.length === 0 && !showEnergy && (
        <div className="mt-6 rounded-4xl bg-surface-container-low p-10 text-center ring-1 ring-black/5">
          <HeartPulse size={18} className="mx-auto text-primary" />
          <p className="mt-3 text-sm text-on-surface-variant">No health cards match this search yet.</p>
        </div>
      )}

      <section className="mt-8">
          <div className="flex w-full gap-10 justify-stretch">
            <section className="rounded-[2.25rem] flex justify-center min-w-2/3 bg-surface-container-low p-8 shadow-[0_10px_24px_rgba(22,29,24,0.04)] ring-1 ring-black/5 lg:p-10">
              <div className="flex flex-col gap-8 w-full md:flex-row md:items-center">
                <div className="relative flex h-48 w-48 items-center justify-center">
                  <svg className="h-full w-full -rotate-90">
                    <circle cx="96" cy="96" r="84" fill="transparent" className="text-surface-container-highest" stroke="currentColor" strokeWidth="12" />
                    <circle
                      cx="96"
                      cy="96"
                      r="84"
                      fill="transparent"
                      className="text-primary-container"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeDasharray={circleCircumference}
                      strokeDashoffset={circleOffset}
                      strokeWidth="12"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="block font-display text-3xl font-black tracking-tight text-on-surface">{stepsToday.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">Steps Today</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-end gap-3">
                    {weeklySteps.map((entry, index) => {
                      const isToday = index === weeklySteps.length - 1
                      const computedHeight =
                        entry.steps === 0 ? 4 : Math.max(24, Math.round((entry.steps / maxStepsForBar) * 96))

                      return (
                        <div
                          key={`${entry.day}-${index}`}
                          className={[
                            'w-full rounded-full',
                            entry.steps === 0
                              ? 'bg-surface-container-low'
                              : isToday
                              ? 'bg-primary-container'
                              : 'bg-surface-container-highest',
                          ].join(' ')}
                          style={{ height: `${computedHeight}px` }}
                        />
                      )
                    })}
                  </div>
                  <div className="mt-4 flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    {weeklySteps.map((entry, index) => (
                      <span key={`${entry.day}-${index}-label`} className={index === weeklySteps.length - 1 ? 'text-primary' : ''}>
                        {entry.day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <HydrationTrackerCard
              targetGlasses={profile.waterGoal}
              currentGlasses={hydrationCount}
              onGlassClick={(_, isActive) => {
                if (isActive) {
                  removeWaterGlass(todayDate)
                  return
                }

                addWaterGlass(todayDate)
              }}
            />
          </div>


      </section>
          <div className="mt-6 flex gap-10">
            <section className="rounded-[2.25rem] flex-2 bg-surface-container-lowest p-8 shadow-[0_10px_24px_rgba(22,29,24,0.04)] ring-1 ring-black/5 lg:p-10">
              <div className="mb-10 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold tracking-tight text-on-surface">Weight Evolution</h2>
                  <p className="text-sm text-on-surface-variant">Stability is progress.</p>
                </div>
                <div className="inline-flex rounded-full bg-surface-container-low p-1 text-[10px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">
                  <button
                    type="button"
                    onClick={() => setMonthRange(1)}
                    className={[
                      'rounded-full px-3 py-1 transition-colors',
                      monthRange === 1 ? 'bg-primary text-on-primary' : 'text-on-surface-variant',
                    ].join(' ')}
                  >
                    1M
                  </button>
                  <button
                    type="button"
                    onClick={() => setMonthRange(3)}
                    className={[
                      'rounded-full px-3 py-1 transition-colors',
                      monthRange === 3 ? 'bg-primary text-on-primary' : 'text-on-surface-variant',
                    ].join(' ')}
                  >
                    3M
                  </button>
                  <button
                    type="button"
                    onClick={() => setMonthRange(999)}
                    className={[
                      'rounded-full px-3 py-1 transition-colors',
                      monthRange === 999 ? 'bg-primary text-on-primary' : 'text-on-surface-variant',
                    ].join(' ')}
                  >
                    ALL
                  </button>
                </div>
              </div>

              {weightHistory.length < 2 ? (
                <div className="relative h-56 rounded-xl bg-surface-container-low flex items-center justify-center text-sm text-on-surface-variant">
                  Log weight on more days to see your trend
                </div>
              ) : (
                <div className="relative h-56">
                  <svg className="h-full w-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <path
                      d={weightHistory
                        .map((entry, index) => {
                          const min = Math.min(...weightHistory.map((item) => item.weight))
                          const max = Math.max(...weightHistory.map((item) => item.weight))
                          const spread = max - min || 1
                          const x = (index / (weightHistory.length - 1)) * 400
                          const y = 88 - ((entry.weight - min) / spread) * 54
                          return `${index === 0 ? 'M' : 'L'}${x},${y}`
                        })
                        .join(' ')}
                      fill="none"
                      stroke="#08bc71"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                </div>
              )}

              <div className="mt-6 flex justify-between text-[10px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">
                {monthLabels.map((monthLabel) => (
                  <span key={monthLabel}>{monthLabel}</span>
                ))}
              </div>
            </section>

            <SleepCyclesCard entries={sleepEntries} sleepGoal={profile.sleepGoal} />
          </div>
        <div className="col-span-12 mt-10 lg:col-span-4">
          <ActivityHeatmapCard
            title="Monthly Cultivation"
            subtitle="Each day is a seed planted for your future self. Watch your garden grow."
            imageUrl={forestImage}
            cells={heatmapCells}
            percentage={monthlyConsistency.percentage}
          />
        </div>

      <DailyCheckInModal isOpen={showCheckIn} onClose={() => setShowCheckIn(false)} />
    </div>
  )
}

export default HealthPage

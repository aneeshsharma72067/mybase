import { Droplets, Footprints, HeartPulse, MoonStar, Scale, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ActivityHeatmapCard } from '../components/health/ActivityHeatmapCard'
import { HealthHeader } from '../components/health/HealthHeader'
import { HealthMetricCard } from '../components/health/HealthMetricCard'
import { HydrationTrackerCard } from '../components/health/HydrationTrackerCard'
import { SleepCyclesCard } from '../components/health/SleepCyclesCard'

const forestImage = '/images/health/health-forest.jpg'

const metricCards = [
  { label: 'Steps', value: '8.4k', subtext: 'Target: 10k', icon: Footprints, tone: 'primary' as const },
  { label: 'Weight', value: '64.2kg', subtext: '-0.5kg vs last week', icon: Scale, tone: 'secondary' as const },
  { label: 'Water', value: '5/8', subtext: '+2 from last hour', icon: Droplets, tone: 'blue' as const },
  { label: 'Sleep', value: '7.5h', subtext: '92% quality', icon: MoonStar, tone: 'indigo' as const },
  { label: 'Energy', value: 'OK', subtext: 'Breath and focus aligned', icon: Zap, tone: 'tertiary' as const },
]

const sleepEntries = [
  { day: 'Sun', hours: 8.2 },
  { day: 'Sat', hours: 9.0 },
  { day: 'Fri', hours: 6.5 },
  { day: 'Thu', hours: 7.2 },
  { day: 'Wed', hours: 7.8 },
]

const activityIntensities = [
  0.2, 0.4, 0.15, 0.6, 0.25, 0.85, 0.3,
  0.9, 0.45, 1, 0.2, 0.4, 0.6, 0.1,
  0.2, 0.35, 0.5, 0.75, 0.9, 0.45, 0.2,
  0.3, 0.6, 0.8, 0.2, 0.45, 0.95, 1,
  0.12, 0.3, 0.4, 0.2, 0.12, 0.12, 0.12,
]

export function HealthPage() {
  const [query, setQuery] = useState('')
  const [currentGlasses, setCurrentGlasses] = useState(5)

  const visibleMetricCards = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return metricCards
    }

    return metricCards.filter((card) => {
      const haystack = `${card.label} ${card.value} ${card.subtext}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [query])

  return (
    <div className="mx-auto w-full max-w-6xl animate-[bookmarks-layout-enter_280ms_cubic-bezier(0.22,1,0.36,1)]">
      <HealthHeader query={query} onQueryChange={setQuery} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {visibleMetricCards.map((card) => (
          <HealthMetricCard
            key={card.label}
            label={card.label}
            value={card.value}
            subtext={card.subtext}
            icon={card.icon}
            tone={card.tone}
          />
        ))}
      </div>

      {visibleMetricCards.length === 0 && (
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
                      strokeDasharray="527.7"
                      strokeDashoffset="100"
                      strokeWidth="12"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="block font-display text-3xl font-black tracking-tight text-on-surface">8,432</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">Steps Today</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-end gap-3">
                    <div className="w-full rounded-full bg-surface-container-highest" style={{ height: '60px' }} />
                    <div className="w-full rounded-full bg-surface-container-highest" style={{ height: '84px' }} />
                    <div className="w-full rounded-full bg-surface-container-highest" style={{ height: '46px' }} />
                    <div className="w-full rounded-full bg-surface-container-highest" style={{ height: '70px' }} />
                    <div className="w-full rounded-full bg-primary-container" style={{ height: '96px' }} />
                    <div className="w-full rounded-full bg-surface-container-highest" style={{ height: '55px' }} />
                    <div className="w-full rounded-full bg-surface-container-highest" style={{ height: '78px' }} />
                  </div>
                  <div className="mt-4 flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span className="text-primary">Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>
            </section>

            <HydrationTrackerCard
              targetGlasses={8}
              currentGlasses={currentGlasses}
              onDecrease={() => setCurrentGlasses((value) => Math.max(0, value - 1))}
              onIncrease={() => setCurrentGlasses((value) => Math.min(8, value + 1))}
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
                <span className="rounded-full bg-surface-container-low px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">3 Months</span>
              </div>

              <div className="relative h-56">
                <svg className="h-full w-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                  <path d="M0,80 Q50,75 100,85 T200,60 T300,65 T400,50" fill="none" stroke="#08bc71" strokeLinecap="round" strokeWidth="3.5" />
                  <path d="M0,80 Q50,75 100,85 T200,60 T300,65 T400,50 L400,100 L0,100 Z" fill="url(#weight-gradient)" opacity="0.12" />
                  <defs>
                    <linearGradient id="weight-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#08bc71" stopOpacity="1" />
                      <stop offset="100%" stopColor="#08bc71" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute left-[50%] top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                  <div className="h-3 w-3 rounded-full border-4 border-white bg-primary shadow-lg" />
                  <div className="mt-2 rounded-md bg-surface-container-low px-2 py-1 text-[10px] font-bold text-on-surface">64.2kg</div>
                </div>
              </div>

              <div className="mt-6 flex justify-between text-[10px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">
                <span>June</span>
                <span>July</span>
                <span>August</span>
              </div>
            </section>

            <SleepCyclesCard entries={sleepEntries} />
          </div>
        <div className="col-span-12 mt-10 lg:col-span-4">
          <ActivityHeatmapCard
            title="Monthly Cultivation"
            subtitle="Each day is a seed planted for your future self. Watch your garden grow."
            imageUrl={forestImage}
            intensities={activityIntensities}
          />
        </div>
    </div>
  )
}

export default HealthPage

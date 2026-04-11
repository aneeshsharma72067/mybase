import { BookOpen, Dumbbell, Grid2x2, LayoutList, Palette } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ActiveQuestCard } from '../components/goals/ActiveQuestCard'
import { GoalImageCard } from '../components/goals/GoalImageCard'
import { GoalProgressCard } from '../components/goals/GoalProgressCard'
import { GoalsHeader } from '../components/goals/GoalsHeader'
import { GoalsQuoteCard } from '../components/goals/GoalsQuoteCard'
import { MomentumOverviewCard } from '../components/goals/MomentumOverviewCard'
import { NewGoalCard } from '../components/goals/NewGoalCard'

const forestImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCEbiR53ikqYMZvt8bg4_bMDkpfUohpaj1ydpes9HWNg20KqMBR7YMOgQ3a2ZY1G7MfqiZF5-ATqLEKTDq53Vph9moMEg84oXkGvPsYNskV3eT77oHWkhIKLh1fSZFVdZa114Ria3t-5snqkomHAIj4cp0mLw8XvYg4Y1k4IM2K_XhP6Ifdq0qXfXwrLX9eZl_xz-bElIK2xxUF7VgKAdsur3d2iAoL4hcQECoQ9Rd5dMbQkEW6437Rl-jEOPQECrhh57brXa94Xl0'

type ViewMode = 'grid' | 'list'

type GoalCardSeed = {
  id: string
  title: string
  description: string
  label: string
  value: string
  progress: number
  accent: 'primary' | 'secondary' | 'tertiary'
  icon: typeof Palette
}

const seededGoals: GoalCardSeed[] = [
  {
    id: 'portfolio',
    title: 'Design Portfolio 2024',
    description: 'Refresh visual language and add 5 case studies focused on organic UI patterns.',
    label: 'Remaining',
    value: '14 days',
    progress: 92,
    accent: 'secondary',
    icon: Palette,
  },
  {
    id: 'reading',
    title: 'Reading Marathon',
    description: 'Complete 12 books on behavioral psychology and environmental philosophy.',
    label: 'Completed',
    value: '4/12',
    progress: 33,
    accent: 'tertiary',
    icon: BookOpen,
  },
  {
    id: 'marathon',
    title: 'Mountain Marathon',
    description: 'Training for the Dolomites Vertical Run in late autumn with weekly intervals.',
    label: 'Weekly Stat',
    value: '42km done',
    progress: 65,
    accent: 'primary',
    icon: Dumbbell,
  },
]

export function GoalsPage() {
  const [searchValue, setSearchValue] = useState('')
  const [statusText, setStatusText] = useState('3 active goals in focus')
  const [goalCards, setGoalCards] = useState(seededGoals)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const filteredGoalCards = useMemo(() => {
    const query = searchValue.trim().toLowerCase()

    if (!query) {
      return goalCards
    }

    return goalCards.filter((goal) => goal.title.toLowerCase().includes(query))
  }, [goalCards, searchValue])

  function handleCreateGoal() {
    const nextGoal: GoalCardSeed = {
      id: `goal-${goalCards.length + 1}`,
      title: 'New Goal Draft',
      description: 'Define a measurable target and break it into weekly milestones.',
      label: 'Remaining',
      value: '30 days',
      progress: 10,
      accent: 'primary',
      icon: Palette,
    }

    setGoalCards((current) => [nextGoal, ...current])
    setStatusText('New vision created')
  }

  return (
    <div className="mx-auto w-full max-w-400">
      <GoalsHeader
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenSettings={() => setStatusText('Settings opened')}
        onOpenArchive={() => setStatusText('Archive viewed')}
        onOpenNotifications={() => setStatusText('Notifications checked')}
        statusText={statusText}
      />

      <section className="mb-8 grid grid-cols-12 gap-6 lg:mb-10">
        <ActiveQuestCard
          title="Mastering Sustainable Architecture"
          progress={78}
          onDetails={() => setStatusText('Viewing active quest details')}
        />
        <MomentumOverviewCard
          deltas={[60, 85, 40, 95, 75]}
          note="Your activity increased by 12% this week."
        />
      </section>

      <div className="mb-6 flex justify-end md:hidden">
        <div className="relative flex items-center gap-1 rounded-full border border-outline-variant/20 bg-surface-container-lowest p-1">
          <span
            aria-hidden="true"
            className={[
              'absolute left-1 top-1 h-9 w-9 rounded-full bg-primary transition-transform duration-300 ease-out',
              viewMode === 'grid' ? 'translate-x-0' : 'translate-x-9',
            ].join(' ')}
          />
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={[
              'relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300',
              viewMode === 'grid' ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface',
            ].join(' ')}
            aria-label="Grid view"
          >
            <Grid2x2 size={15} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={[
              'relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300',
              viewMode === 'list' ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface',
            ].join(' ')}
            aria-label="List view"
          >
            <LayoutList size={15} />
          </button>
        </div>
      </div>

      <section
        key={viewMode}
        className={[
          'goals-layout-enter grid gap-6',
          viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'mx-auto grid-cols-1 xl:max-w-5xl',
        ].join(' ')}
      >
        <GoalImageCard
          title="Wilderness Solo Trip"
          category="Personal"
          stage="Stage 3 of 7: Equipment Prep"
          progress={45}
          imageUrl={forestImage}
        />

        {filteredGoalCards.map((goal) => (
          <GoalProgressCard
            key={goal.id}
            icon={goal.icon}
            title={goal.title}
            description={goal.description}
            label={goal.label}
            value={goal.value}
            progress={goal.progress}
            accent={goal.accent}
          />
        ))}

        <NewGoalCard onCreate={handleCreateGoal} />
        <GoalsQuoteCard
          quote="Nature does not hurry, yet everything is accomplished."
          author="- Lao Tzu"
        />
      </section>
    </div>
  )
}

export default GoalsPage
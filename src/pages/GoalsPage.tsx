import { BookOpen, Dumbbell, Grid2x2, LayoutList, Palette, Sparkles } from 'lucide-react'
import { differenceInCalendarDays, format } from 'date-fns'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActiveQuestCard } from '../components/goals/ActiveQuestCard'
import { AddGoalModal } from '../components/goals/AddGoalModal'
import { GoalDetailsDrawer } from '../components/goals/GoalDetailsDrawer'
import { GoalImageCard } from '../components/goals/GoalImageCard'
import { GoalProgressCard } from '../components/goals/GoalProgressCard'
import { GoalsHeader } from '../components/goals/GoalsHeader'
import { GoalsListView, type GoalListItem } from '../components/goals/GoalsListView'
import { GoalsQuoteCard } from '../components/goals/GoalsQuoteCard'
import { MomentumOverviewCard } from '../components/goals/MomentumOverviewCard'
import { NewGoalCard } from '../components/goals/NewGoalCard'
import { getActiveGoals, getFocusedGoal, getGoalProgress, getMomentumData, useGoalsStore } from '../store/useGoalsStore'
import type { Goal } from '../types/goal.types'

const forestImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCEbiR53ikqYMZvt8bg4_bMDkpfUohpaj1ydpes9HWNg20KqMBR7YMOgQ3a2ZY1G7MfqiZF5-ATqLEKTDq53Vph9moMEg84oXkGvPsYNskV3eT77oHWkhIKLh1fSZFVdZa114Ria3t-5snqkomHAIj4cp0mLw8XvYg4Y1k4IM2K_XhP6Ifdq0qXfXwrLX9eZl_xz-bElIK2xxUF7VgKAdsur3d2iAoL4hcQECoQ9Rd5dMbQkEW6437Rl-jEOPQECrhh57brXa94Xl0'

type ViewMode = 'grid' | 'list'

function getGoalIcon(goal: Goal) {
  const category = goal.category?.toLowerCase() ?? ''

  if (goal.type === 'numeric' || category.includes('health')) {
    return Dumbbell
  }

  if (category.includes('growth')) {
    return BookOpen
  }

  if (category.includes('personal')) {
    return Sparkles
  }

  return Palette
}

function getGoalAccent(goal: Goal): 'primary' | 'secondary' | 'tertiary' {
  const category = goal.category?.toLowerCase() ?? ''

  if (goal.type === 'numeric' || category.includes('professional')) {
    return 'primary'
  }

  if (category.includes('growth')) {
    return 'tertiary'
  }

  return 'secondary'
}

function getCategoryTone(goal: Goal): 'primary' | 'secondary' | 'tertiary' {
  return getGoalAccent(goal)
}

function getStatusTone(goal: Goal): 'primary' | 'secondary' | 'muted' {
  if (goal.status === 'completed') {
    return 'secondary'
  }

  if (goal.status === 'paused' || goal.status === 'archived') {
    return 'muted'
  }

  return 'primary'
}

function getDeadlineTone(goal: Goal): 'primary' | 'error' | 'muted' {
  if (!goal.deadline) {
    return 'muted'
  }

  const remainingDays = differenceInCalendarDays(new Date(goal.deadline), new Date())

  if (remainingDays <= 3) {
    return 'error'
  }

  if (remainingDays <= 10) {
    return 'primary'
  }

  return 'muted'
}

function getDeadlineHint(goal: Goal): string {
  if (!goal.deadline) {
    return 'No deadline'
  }

  const remainingDays = differenceInCalendarDays(new Date(goal.deadline), new Date())

  if (remainingDays < 0) {
    return 'Overdue'
  }

  if (remainingDays === 0) {
    return 'Due today'
  }

  if (remainingDays === 1) {
    return '1 day left'
  }

  return `${remainingDays} days left`
}

function getProgressLabel(goal: Goal): string {
  if (goal.type === 'numeric') {
    return `${goal.current ?? 0} / ${goal.target ?? 0}${goal.unit ? ` ${goal.unit}` : ''}`
  }

  const completed = goal.milestones.filter((milestone) => milestone.done).length
  return `${completed} of ${goal.milestones.length} milestones`
}

function getGoalListItem(goal: Goal): GoalListItem {
  return {
    id: goal.id,
    icon: getGoalIcon(goal),
    title: goal.title,
    category: goal.category ?? 'General',
    categoryTone: getCategoryTone(goal),
    progress: getGoalProgress(goal),
    progressLabel: getProgressLabel(goal),
    deadline: goal.deadline ? format(new Date(goal.deadline), 'MMM d, yyyy') : 'No deadline',
    deadlineHint: getDeadlineHint(goal),
    deadlineTone: getDeadlineTone(goal),
    status: goal.status,
    statusTone: getStatusTone(goal),
  }
}

export function GoalsPage() {
  const navigate = useNavigate()
  const goals = useGoalsStore((state) => state.goals)
  const activeGoalId = useGoalsStore((state) => state.activeGoalId)
  const setActiveGoal = useGoalsStore((state) => state.setActiveGoal)
  const focusedGoal = useMemo(() => getFocusedGoal(goals), [goals])
  const activeGoals = useMemo(() => getActiveGoals(goals), [goals])
  const momentum = useMemo(() => getMomentumData(goals), [goals])
  const [searchValue, setSearchValue] = useState('')
  const [statusText] = useState('Goals synced')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [drawerGoal, setDrawerGoal] = useState<Goal | null>(null)
  const drawerTimerRef = useRef<number | null>(null)

  const filteredActiveGoals = useMemo(() => {
    const query = searchValue.trim().toLowerCase()

    if (!query) {
      return activeGoals
    }

    return activeGoals.filter((goal) => {
      const haystack = [goal.title, goal.description, goal.category]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [activeGoals, searchValue])

  const listViewGoals = useMemo(() => {
    return filteredActiveGoals.map<GoalListItem>(getGoalListItem)
  }, [filteredActiveGoals])

  const momentumTotal = useMemo(() => momentum.reduce((sum, entry) => sum + entry.count, 0), [momentum])
  const momentumNote =
    momentumTotal === 0
      ? 'No activity logged this week.'
      : momentumTotal < 5
        ? `${momentumTotal} milestones completed this week.`
        : `${momentumTotal} milestones completed. Strong week.`

  const showFeatureCards = activeGoals.length > 0

  useEffect(() => {
    if (drawerTimerRef.current !== null) {
      window.clearTimeout(drawerTimerRef.current)
      drawerTimerRef.current = null
    }

    if (activeGoalId) {
      const nextGoal = goals.find((goal) => goal.id === activeGoalId) ?? null
      setDrawerGoal(nextGoal)
      return
    }

    if (drawerGoal) {
      drawerTimerRef.current = window.setTimeout(() => {
        setDrawerGoal(null)
      }, 240)
    }
  }, [activeGoalId, drawerGoal, goals])

  useEffect(() => {
    return () => {
      if (drawerTimerRef.current !== null) {
        window.clearTimeout(drawerTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="mx-auto w-full max-w-400">
      <GoalsHeader
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenSettings={() => navigate('/settings')}
        statusText={statusText}
      />

      <section className="mb-8 grid grid-cols-12 gap-6 lg:mb-10">
        {focusedGoal ? (
          <ActiveQuestCard
            title={focusedGoal.title}
            progress={getGoalProgress(focusedGoal)}
            onDetails={() => setActiveGoal(focusedGoal.id)}
          />
        ) : (
          <div className="col-span-12 flex h-72 items-center justify-center rounded-xl bg-surface-container-high p-8 text-center text-on-surface-variant lg:col-span-8 lg:h-80 lg:p-10">
            <p>Pin a goal to set your Active Quest</p>
          </div>
        )}

        <MomentumOverviewCard momentum={momentum} note={momentumNote} />
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
          viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'mx-auto grid-cols-1',
        ].join(' ')}
      >
        {viewMode === 'grid' ? (
          <>
            {showFeatureCards ? (
              <GoalImageCard
                title="Wilderness Solo Trip"
                category="Personal"
                stage="Stage 3 of 7: Equipment Prep"
                progress={45}
                imageUrl={forestImage}
              />
            ) : null}

            {filteredActiveGoals.length > 0 ? (
              filteredActiveGoals.map((goal) => (
                <GoalProgressCard key={goal.id} goal={goal} icon={getGoalIcon(goal)} accent={getGoalAccent(goal)} />
              ))
            ) : showFeatureCards ? (
              <div className="flex h-80 items-center justify-center rounded-xl bg-surface-container-lowest p-8 text-center text-on-surface-variant lg:h-96">
                No active goals match this search.
              </div>
            ) : null}

            <NewGoalCard onCreate={() => setShowAddGoal(true)} />

            {showFeatureCards ? <GoalsQuoteCard /> : null}
          </>
        ) : (
          <div className="xl:col-span-3">
            <GoalsListView goals={listViewGoals} onCreate={() => setShowAddGoal(true)} />
          </div>
        )}
      </section>

      {drawerGoal ? <GoalDetailsDrawer goal={drawerGoal} /> : null}
      <AddGoalModal isOpen={showAddGoal} onClose={() => setShowAddGoal(false)} />
    </div>
  )
}

export default GoalsPage

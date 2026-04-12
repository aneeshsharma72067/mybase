import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { format, isSameDay, subDays } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { createZustandStorage } from '../lib/storage'
import type { Goal, GoalLog, GoalMilestone, GoalStoreState } from '../types/goal.types'

type GoalsStoreActions = {
  addGoal: (
    payload: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'logs' | 'milestones'> & {
      milestones?: Omit<GoalMilestone, 'id' | 'done' | 'completedAt'>[]
    },
  ) => void
  updateGoal: (id: string, patch: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  pinGoal: (id: string) => void
  toggleMilestone: (goalId: string, milestoneId: string) => void
  logProgress: (goalId: string, value: number, note?: string) => void
  setActiveGoal: (id: string | null) => void
}

export type GoalsStore = GoalStoreState & GoalsStoreActions

function isoDaysAgo(daysAgo: number): string {
  return subDays(new Date(), daysAgo).toISOString()
}

function deadlineDaysAhead(daysAhead: number): string {
  return format(subDays(new Date(), -daysAhead), 'yyyy-MM-dd')
}

function createMilestone(label: string, done: boolean, completedDaysAgo?: number): GoalMilestone {
  return {
    id: uuidv4(),
    label,
    done,
    completedAt: done && completedDaysAgo !== undefined ? isoDaysAgo(completedDaysAgo) : undefined,
  }
}

function createLog(value: number, note: string | undefined, daysAgo: number): GoalLog {
  return {
    id: uuidv4(),
    value,
    note,
    loggedAt: isoDaysAgo(daysAgo),
  }
}

const seedGoals: Goal[] = [
  {
    id: uuidv4(),
    title: 'Mastering Sustainable Architecture',
    description: 'Refine the final concept pack and close out the remaining review notes.',
    type: 'milestone',
    status: 'active',
    isFocused: true,
    milestones: [
      createMilestone('Define the project narrative', true, 6),
      createMilestone('Sketch the spatial flow', true, 5),
      createMilestone('Model the roofline study', true, 4),
      createMilestone('Review material palette', true, 3),
      createMilestone('Finalize presentation board', false),
      createMilestone('Prepare stakeholder walkthrough', false),
    ],
    logs: [
      createLog(1, 'Define the project narrative', 6),
      createLog(1, 'Sketch the spatial flow', 5),
      createLog(1, 'Model the roofline study', 4),
      createLog(1, 'Review material palette', 3),
    ],
    deadline: deadlineDaysAhead(11),
    category: 'Professional',
    createdAt: isoDaysAgo(23),
    updatedAt: isoDaysAgo(1),
  },
  {
    id: uuidv4(),
    title: 'Reading Marathon',
    description: 'Complete twelve books on systems thinking and long-form design practice.',
    type: 'milestone',
    status: 'active',
    isFocused: false,
    milestones: [
      createMilestone('Finish chapter 1', true, 7),
      createMilestone('Finish chapter 2', true, 6),
      createMilestone('Finish chapter 3', true, 4),
      createMilestone('Finish chapter 4', true, 2),
      createMilestone('Finish chapter 5', false),
      createMilestone('Finish chapter 6', false),
      createMilestone('Finish chapter 7', false),
      createMilestone('Finish chapter 8', false),
      createMilestone('Finish chapter 9', false),
      createMilestone('Finish chapter 10', false),
      createMilestone('Finish chapter 11', false),
      createMilestone('Finish chapter 12', false),
    ],
    logs: [
      createLog(1, 'Finish chapter 1', 7),
      createLog(1, 'Finish chapter 2', 6),
      createLog(1, 'Finish chapter 3', 4),
      createLog(1, 'Finish chapter 4', 2),
    ],
    deadline: deadlineDaysAhead(42),
    category: 'Growth',
    createdAt: isoDaysAgo(18),
    updatedAt: isoDaysAgo(2),
  },
  {
    id: uuidv4(),
    title: 'Mountain Marathon',
    description: 'Stay consistent with weekly training volume and long-run pacing.',
    type: 'numeric',
    status: 'active',
    isFocused: false,
    milestones: [],
    target: 100,
    current: 42,
    unit: 'km',
    logs: [
      createLog(10, 'Hill repeats', 6),
      createLog(12, 'Tempo run', 3),
      createLog(20, 'Long run', 1),
    ],
    deadline: deadlineDaysAhead(28),
    category: 'Health',
    createdAt: isoDaysAgo(12),
    updatedAt: isoDaysAgo(1),
  },
  {
    id: uuidv4(),
    title: 'Wild Garden Deck',
    description: 'Ship the first draft of the garden planning deck and gather feedback.',
    type: 'milestone',
    status: 'active',
    isFocused: false,
    milestones: [
      createMilestone('Collect reference images', true, 5),
      createMilestone('Draft the opening slide', false),
      createMilestone('Write the planting notes', false),
      createMilestone('Review layout with team', false),
      createMilestone('Publish the deck', false),
    ],
    logs: [
      createLog(1, 'Collect reference images', 5),
      createLog(1, 'Collect reference images', 2),
    ],
    deadline: deadlineDaysAhead(19),
    category: 'Personal',
    createdAt: isoDaysAgo(8),
    updatedAt: isoDaysAgo(2),
  },
  {
    id: uuidv4(),
    title: 'Portfolio Refresh',
    description: 'Archive the old showcase and publish three sharper case studies.',
    type: 'numeric',
    status: 'paused',
    isFocused: false,
    milestones: [],
    target: 3,
    current: 1,
    unit: 'case studies',
    logs: [createLog(1, 'Drafted case study outline', 7)],
    deadline: deadlineDaysAhead(56),
    category: 'Professional',
    createdAt: isoDaysAgo(27),
    updatedAt: isoDaysAgo(7),
  },
]

const initialState: GoalStoreState = {
  goals: seedGoals,
  activeGoalId: seedGoals[0]?.id ?? null,
}

function findLogIndexToRemove(goal: Goal, milestoneLabel: string, completedAt: string): number {
  for (let index = goal.logs.length - 1; index >= 0; index -= 1) {
    const entry = goal.logs[index]

    if (entry.note === milestoneLabel && isSameDay(new Date(entry.loggedAt), new Date(completedAt))) {
      return index
    }
  }

  return -1
}

export const useGoalsStore = create<GoalsStore>()(
  persist(
    immer((set) => ({
      ...initialState,
      addGoal: (payload) => {
        set((state) => {
          if (payload.isFocused) {
            state.goals.forEach((goal) => {
              goal.isFocused = false
            })
          }

          const now = new Date().toISOString()

          state.goals.push({
            ...payload,
            id: uuidv4(),
            milestones: (payload.milestones ?? []).map((milestone) => ({
              id: uuidv4(),
              label: milestone.label,
              done: false,
            })),
            logs: [],
            current: payload.type === 'numeric' ? payload.current ?? 0 : undefined,
            createdAt: now,
            updatedAt: now,
          })
        })
      },
      updateGoal: (id, patch) => {
        set((state) => {
          const goal = state.goals.find((item) => item.id === id)

          if (!goal) {
            return
          }

          if (patch.isFocused) {
            state.goals.forEach((item) => {
              item.isFocused = item.id === id
            })
          }

          Object.assign(goal, patch)
          goal.updatedAt = new Date().toISOString()
        })
      },
      deleteGoal: (id) => {
        set((state) => {
          state.goals = state.goals.filter((goal) => goal.id !== id)

          if (state.activeGoalId === id) {
            state.activeGoalId = null
          }
        })
      },
      pinGoal: (id) => {
        set((state) => {
          const goal = state.goals.find((item) => item.id === id)

          if (!goal || goal.isFocused) {
            return
          }

          state.goals.forEach((item) => {
            item.isFocused = item.id === id
          })
        })
      },
      toggleMilestone: (goalId, milestoneId) => {
        set((state) => {
          const goal = state.goals.find((item) => item.id === goalId)
          const milestone = goal?.milestones.find((item) => item.id === milestoneId)

          if (!goal || !milestone) {
            return
          }

          const now = new Date().toISOString()
          milestone.done = !milestone.done

          if (milestone.done) {
            milestone.completedAt = now
            goal.logs.push({
              id: uuidv4(),
              value: 1,
              note: milestone.label,
              loggedAt: now,
            })
          } else {
            const removeIndex = findLogIndexToRemove(goal, milestone.label, milestone.completedAt ?? now)

            milestone.completedAt = undefined

            if (removeIndex >= 0) {
              goal.logs.splice(removeIndex, 1)
            }
          }

          const allDone = goal.milestones.length > 0 && goal.milestones.every((item) => item.done)

          if (allDone) {
            goal.status = 'completed'
          } else if (goal.status === 'completed') {
            goal.status = 'active'
          }

          goal.updatedAt = now
        })
      },
      logProgress: (goalId, value, note) => {
        set((state) => {
          const goal = state.goals.find((item) => item.id === goalId)

          if (!goal || goal.type !== 'numeric') {
            return
          }

          const now = new Date().toISOString()

          goal.logs.push({
            id: uuidv4(),
            value,
            note,
            loggedAt: now,
          })

          goal.current = (goal.current ?? 0) + value

          if (goal.target !== undefined && goal.current >= goal.target) {
            goal.status = 'completed'
          }

          goal.updatedAt = now
        })
      },
      setActiveGoal: (id) => {
        set((state) => {
          state.activeGoalId = id
        })
      },
    })),
    {
      name: 'mybase-goals',
      storage: createZustandStorage(),
      partialize: (state) => ({ goals: state.goals, activeGoalId: state.activeGoalId }),
    },
  ),
)

export function getFocusedGoal(goals: Goal[]): Goal | undefined {
  return goals.find((goal) => goal.isFocused)
}

export function getActiveGoals(goals: Goal[]): Goal[] {
  return goals
    .filter((goal) => goal.status === 'active' && !goal.isFocused)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
}

export function getGoalProgress(goal: Goal): number {
  if (goal.type === 'milestone') {
    if (goal.milestones.length === 0) {
      return 0
    }

    return Math.round((goal.milestones.filter((milestone) => milestone.done).length / goal.milestones.length) * 100)
  }

  if (!goal.target || goal.target <= 0) {
    return 0
  }

  return Math.round(Math.min(100, ((goal.current ?? 0) / goal.target) * 100))
}

export function getMomentumData(goals: Goal[]): { day: string; count: number }[] {
  return Array.from({ length: 7 }, (_, index) => {
    const dayDate = subDays(new Date(), 6 - index)
    const dayKey = format(dayDate, 'yyyy-MM-dd')

    const count = goals.reduce((total, goal) => {
      return total + goal.logs.filter((entry) => entry.loggedAt.startsWith(dayKey)).length
    }, 0)

    return {
      day: format(dayDate, 'EEE'),
      count,
    }
  })
}
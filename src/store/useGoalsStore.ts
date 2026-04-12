import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { format, isSameDay, subDays } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { createZustandStorage } from '../lib/storage'
import type { Goal, GoalMilestone, GoalStoreState } from '../types/goal.types'

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

const initialState: GoalStoreState = {
  goals: [],
  activeGoalId: null,
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
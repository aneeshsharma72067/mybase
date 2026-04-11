import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { createZustandStorage } from '../lib/storage'
import { generateId } from '../lib/utils'
import type { Goal, GoalStoreState } from '../types/goal.types'

type GoalsStoreActions = {
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void
  updateGoal: (id: string, patch: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  updateProgress: (id: string, current: number) => void
  toggleMilestone: (goalId: string, milestoneId: string) => void
}

export type GoalsStore = GoalStoreState & GoalsStoreActions

const initialState: GoalStoreState = {
  goals: [],
}

function resolveStatus(current: number, target: number, currentStatus: Goal['status']): Goal['status'] {
  if (current >= target) {
    return 'completed'
  }

  if (currentStatus === 'paused') {
    return 'paused'
  }

  return 'active'
}

export const useGoalsStore = create<GoalsStore>()(
  persist(
    immer((set) => ({
      ...initialState,
      addGoal: (goal) => {
        set((state) => {
          state.goals.push({
            ...goal,
            id: generateId(),
            createdAt: new Date().toISOString(),
          })
        })
      },
      updateGoal: (id, patch) => {
        set((state) => {
          const goal = state.goals.find((item) => item.id === id)

          if (goal) {
            Object.assign(goal, patch)
          }
        })
      },
      deleteGoal: (id) => {
        set((state) => {
          state.goals = state.goals.filter((goal) => goal.id !== id)
        })
      },
      updateProgress: (id, current) => {
        set((state) => {
          const goal = state.goals.find((item) => item.id === id)

          if (goal) {
            goal.current = current
            goal.status = resolveStatus(current, goal.target, goal.status)
          }
        })
      },
      toggleMilestone: (goalId, milestoneId) => {
        set((state) => {
          const goal = state.goals.find((item) => item.id === goalId)
          const milestone = goal?.milestones.find((item) => item.id === milestoneId)

          if (milestone) {
            milestone.done = !milestone.done
          }
        })
      },
    })),
    {
      name: 'mybase-goals',
      storage: createZustandStorage(),
      partialize: (state) => ({ goals: state.goals }),
    },
  ),
)
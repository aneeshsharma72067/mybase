export type GoalStatus = 'active' | 'completed' | 'paused'

export interface GoalMilestone {
  id: string
  label: string
  done: boolean
}

export interface Goal {
  id: string
  title: string
  description?: string
  target: number
  current: number
  unit: string
  status: GoalStatus
  deadline?: string
  milestones: GoalMilestone[]
  createdAt: string
}

export interface GoalStoreState {
  goals: Goal[]
}
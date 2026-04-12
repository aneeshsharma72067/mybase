export type GoalType = 'milestone' | 'numeric'
export type GoalStatus = 'active' | 'completed' | 'paused' | 'archived'

export interface GoalMilestone {
  id: string
  label: string
  done: boolean
  completedAt?: string
}

export interface GoalLog {
  id: string
  value: number
  note?: string
  loggedAt: string
}

export interface Goal {
  id: string
  title: string
  description?: string
  type: GoalType
  status: GoalStatus
  isFocused: boolean
  milestones: GoalMilestone[]
  target?: number
  current?: number
  unit?: string
  deadline?: string
  category?: string
  logs: GoalLog[]
  createdAt: string
  updatedAt: string
}

export interface GoalStoreState {
  goals: Goal[]
  activeGoalId: string | null
}
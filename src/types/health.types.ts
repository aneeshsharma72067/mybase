export interface DailyLog {
  id: string
  date: string            // "YYYY-MM-DD", one entry per day enforced in store
  steps?: number
  weight?: number         // always in kg internally
  waterGlasses?: number   // count of glasses, each = 250ml = 0.25L
  sleepHours?: number     // decimal allowed, e.g. 7.5
  energyLevel?: 1 | 2 | 3 | 4 | 5
  createdAt: string       // ISO string
  updatedAt: string       // ISO string
}

export interface HealthProfile {
  stepGoal: number        // default 10000
  waterGoal: number       // default 8 (glasses)
  sleepGoal: number       // default 8 (hours)
  weightUnit: 'kg' | 'lbs'  // default 'kg'
}

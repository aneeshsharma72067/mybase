import { format, getDaysInMonth, isAfter, isSameDay, parseISO, startOfDay, startOfMonth, subDays, subMonths } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { createZustandStorage } from '../lib/storage'
import type { DailyLog, HealthProfile } from '../types/health.types'

type HealthStoreState = {
  logs: DailyLog[]
  profile: HealthProfile
}

type HealthStoreActions = {
  upsertDailyLog: (payload: Omit<DailyLog, 'id' | 'createdAt' | 'updatedAt'>) => void
  addWaterGlass: (date: string) => void
  removeWaterGlass: (date: string) => void
  updateProfile: (patch: Partial<HealthProfile>) => void
}

export type HealthStore = HealthStoreState & HealthStoreActions

const initialProfile: HealthProfile = {
  stepGoal: 10000,
  waterGoal: 8,
  sleepGoal: 8,
  weightUnit: 'kg',
}

const initialState: HealthStoreState = {
  logs: [],
  profile: initialProfile,
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

function mergeDefinedLogFields(target: DailyLog, source: Omit<DailyLog, 'id' | 'createdAt' | 'updatedAt'>) {
  if (source.steps !== undefined) {
    target.steps = source.steps
  }

  if (source.weight !== undefined) {
    target.weight = source.weight
  }

  if (source.waterGlasses !== undefined) {
    target.waterGlasses = source.waterGlasses
  }

  if (source.sleepHours !== undefined) {
    target.sleepHours = source.sleepHours
  }

  if (source.energyLevel !== undefined) {
    target.energyLevel = source.energyLevel
  }
}

export const useHealthStore = create<HealthStore>()(
  persist(
    immer((set) => ({
      ...initialState,
      upsertDailyLog: (payload) => {
        set((state) => {
          const now = new Date().toISOString()
          const existing = state.logs.find((log) => log.date === payload.date)

          if (existing) {
            mergeDefinedLogFields(existing, payload)
            existing.updatedAt = now
            return
          }

          const next: DailyLog = {
            id: uuidv4(),
            date: payload.date,
            createdAt: now,
            updatedAt: now,
          }

          mergeDefinedLogFields(next, payload)
          state.logs.push(next)
          state.logs.sort((left, right) => left.date.localeCompare(right.date))
        })
      },
      addWaterGlass: (date) => {
        set((state) => {
          const now = new Date().toISOString()
          const cap = state.profile.waterGoal * 2
          const existing = state.logs.find((log) => log.date === date)

          if (existing) {
            const current = existing.waterGlasses ?? 0
            existing.waterGlasses = Math.min(cap, current + 1)
            existing.updatedAt = now
            return
          }

          state.logs.push({
            id: uuidv4(),
            date,
            waterGlasses: 1,
            createdAt: now,
            updatedAt: now,
          })

          state.logs.sort((left, right) => left.date.localeCompare(right.date))
        })
      },
      removeWaterGlass: (date) => {
        set((state) => {
          const existing = state.logs.find((log) => log.date === date)

          if (!existing) {
            return
          }

          const now = new Date().toISOString()
          existing.waterGlasses = Math.max(0, (existing.waterGlasses ?? 0) - 1)
          existing.updatedAt = now
        })
      },
      updateProfile: (patch) => {
        set((state) => {
          state.profile = {
            ...state.profile,
            ...patch,
          }
        })
      },
    })),
    {
      name: 'mybase-health',
      version: 2,
      storage: createZustandStorage(),
      partialize: (state) => ({ logs: state.logs, profile: state.profile }),
      migrate: (persistedState: unknown) => {
        const next = persistedState as Partial<HealthStoreState> | undefined

        return {
          logs: [],
          profile: {
            ...initialProfile,
            ...(next?.profile ?? {}),
          },
        }
      },
    },
  ),
)

export function getTodayLog(logs: DailyLog[]): DailyLog | undefined {
  const today = format(new Date(), 'yyyy-MM-dd')
  return logs.find((log) => log.date === today)
}

export function getLogForDate(logs: DailyLog[], date: string): DailyLog | undefined {
  return logs.find((log) => log.date === date)
}

export function getLastNDaysLogs(logs: DailyLog[], n: number): (DailyLog | null)[] {
  const byDate = new Map(logs.map((log) => [log.date, log] as const))

  return Array.from({ length: n }, (_, index) => {
    const date = format(subDays(new Date(), n - 1 - index), 'yyyy-MM-dd')
    return byDate.get(date) ?? null
  })
}

export function getWeeklySteps(logs: DailyLog[]): { day: string; steps: number }[] {
  return getLastNDaysLogs(logs, 7).map((log, index) => {
    const date = subDays(new Date(), 6 - index)

    return {
      day: format(date, 'EEE').toUpperCase(),
      steps: log?.steps ?? 0,
    }
  })
}

export function getWeightHistory(logs: DailyLog[], months: number): { date: string; weight: number }[] {
  const profile = useHealthStore.getState().profile
  const cutoff = startOfDay(subMonths(new Date(), months))

  return logs
    .filter((log) => log.weight !== undefined)
    .filter((log) => {
      const current = startOfDay(parseISO(log.date))
      return isAfter(current, cutoff) || isSameDay(current, cutoff)
    })
    .sort((left, right) => left.date.localeCompare(right.date))
    .map((log) => {
      const weight = log.weight ?? 0
      return {
        date: log.date,
        weight: profile.weightUnit === 'lbs' ? roundTo(weight * 2.20462, 1) : weight,
      }
    })
}

export function getSleepLastNDays(logs: DailyLog[], n: number): { day: string; hours: number }[] {
  const values = getLastNDaysLogs(logs, n).map((log, index) => {
    const date = subDays(new Date(), n - 1 - index)

    return {
      day: format(date, 'EEE').toUpperCase(),
      hours: log?.sleepHours ?? 0,
    }
  })

  return values.reverse()
}

export function getMonthlyConsistency(logs: DailyLog[]): {
  cells: { date: string; intensity: 0 | 1 | 2 | 3 | 4 }[]
  percentage: number
} {
  const monthStart = startOfMonth(new Date())
  const today = startOfDay(new Date())
  const byDate = new Map(logs.map((log) => [log.date, log] as const))

  const cells: { date: string; intensity: 0 | 1 | 2 | 3 | 4 }[] = []
  let activeDays = 0

  for (let current = monthStart; !isAfter(current, today); current = subDays(current, -1)) {
    const dateKey = format(current, 'yyyy-MM-dd')
    const log = byDate.get(dateKey)

    const loggedMetrics = [
      log?.steps,
      log?.weight,
      log?.waterGlasses,
      log?.sleepHours,
      log?.energyLevel,
    ].filter((value) => value !== undefined).length

    const intensity: 0 | 1 | 2 | 3 | 4 =
      loggedMetrics === 0
        ? 0
        : loggedMetrics <= 2
        ? 1
        : loggedMetrics === 3
        ? 2
        : loggedMetrics === 4
        ? 3
        : 4

    if (intensity > 0) {
      activeDays += 1
    }

    cells.push({
      date: dateKey,
      intensity,
    })
  }

  return {
    cells,
    percentage: cells.length ? Math.round((activeDays / cells.length) * 100) : 0,
  }
}

export function getWeightDelta(logs: DailyLog[], days: number): number | null {
  const weighted = logs
    .filter((log) => log.weight !== undefined)
    .sort((left, right) => left.date.localeCompare(right.date))

  const recent = weighted[weighted.length - 1]

  if (!recent || recent.weight === undefined) {
    return null
  }

  const targetDate = subDays(parseISO(recent.date), days)

  let older: DailyLog | undefined

  for (let index = weighted.length - 1; index >= 0; index -= 1) {
    const candidate = weighted[index]

    if (candidate.weight === undefined) {
      continue
    }

    const candidateDate = parseISO(candidate.date)

    if (!isAfter(candidateDate, targetDate)) {
      older = candidate
      break
    }
  }

  if (!older || older.weight === undefined) {
    return null
  }

  return roundTo(recent.weight - older.weight, 1)
}

export function formatWaterLitres(glasses: number): string {
  return `${(glasses * 0.25).toFixed(2)}L`
}

export function getEnergyEmoji(level: 1 | 2 | 3 | 4 | 5 | undefined): string {
  if (level === 1) {
    return '😴'
  }

  if (level === 2) {
    return '😐'
  }

  if (level === 3) {
    return '🙂'
  }

  if (level === 4) {
    return '😊'
  }

  if (level === 5) {
    return '⚡'
  }

  return '—'
}

export function getCurrentMonthTotalDays(): number {
  return getDaysInMonth(new Date())
}

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

const todayString = format(new Date(), 'yyyy-MM-dd')

function createSeededRandom(seed: number) {
  let value = seed % 2147483647

  if (value <= 0) {
    value += 2147483646
  }

  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

function randomInt(random: () => number, min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min
}

function randomFrom<T>(random: () => number, values: T[]): T {
  return values[Math.floor(random() * values.length)]
}

function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

function createInitialLogs(): DailyLog[] {
  const random = createSeededRandom(18473)
  const now = new Date().toISOString()
  const byDate = new Map<string, DailyLog>()

  const skipCount = randomInt(random, 5, 6)
  const skippedIndices = new Set<number>()

  while (skippedIndices.size < skipCount) {
    const next = randomInt(random, 0, 29)

    if (next !== 0) {
      skippedIndices.add(next)
    }
  }

  let rollingWeight = 64.5

  for (let offset = 29; offset >= 0; offset -= 1) {
    const date = format(subDays(new Date(), offset), 'yyyy-MM-dd')

    if (skippedIndices.has(offset)) {
      continue
    }

    rollingWeight = roundTo(rollingWeight + roundTo(random() * 0.6 - 0.3, 1), 1)

    byDate.set(date, {
      id: uuidv4(),
      date,
      steps: randomInt(random, 4000, 14000),
      weight: rollingWeight,
      waterGlasses: randomInt(random, 3, 9),
      sleepHours: randomFrom(random, [6, 6.5, 7, 7.5, 8, 8.5, 9]),
      energyLevel: randomInt(random, 1, 5) as 1 | 2 | 3 | 4 | 5,
      createdAt: now,
      updatedAt: now,
    })
  }

  byDate.set(todayString, {
    id: byDate.get(todayString)?.id ?? uuidv4(),
    date: todayString,
    steps: 8432,
    weight: 64.2,
    waterGlasses: 5,
    sleepHours: 7.5,
    energyLevel: 4,
    createdAt: byDate.get(todayString)?.createdAt ?? now,
    updatedAt: now,
  })

  return Array.from(byDate.values()).sort((left, right) => left.date.localeCompare(right.date))
}

const initialState: HealthStoreState = {
  logs: createInitialLogs(),
  profile: initialProfile,
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
      storage: createZustandStorage(),
      partialize: (state) => ({ logs: state.logs, profile: state.profile }),
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

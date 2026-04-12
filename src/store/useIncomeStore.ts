import { format, subMonths } from 'date-fns'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { createZustandStorage } from '../lib/storage'
import type { Transaction } from '../types/income.types'

type IncomeStoreActions = {
  addTransaction: (payload: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTransaction: (id: string, patch: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  setSearchQuery: (q: string) => void
}

export type IncomeStoreState = {
  transactions: Transaction[]
  searchQuery: string
}

export type IncomeStore = IncomeStoreState & IncomeStoreActions

const initialState: IncomeStoreState = {
  transactions: [],
  searchQuery: '',
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100
}

function getMonthKey(date: Date): string {
  return format(date, 'yyyy-MM')
}

function getMonthlyWindow(): Array<{ date: Date; key: string; label: string }> {
  return Array.from({ length: 6 }, (_, index) => {
    const date = subMonths(new Date(), 5 - index)

    return {
      date,
      key: getMonthKey(date),
      label: format(date, 'MMM'),
    }
  })
}

function groupTransactionsByMonth(transactions: Transaction[]): Map<string, { income: number; expenses: number; count: number }> {
  const monthMap = new Map<string, { income: number; expenses: number; count: number }>()

  for (const transaction of transactions) {
    const key = transaction.date.slice(0, 7)
    const entry = monthMap.get(key) ?? { income: 0, expenses: 0, count: 0 }
    entry.count += 1

    if (transaction.type === 'income') {
      entry.income += transaction.amount
    } else {
      entry.expenses += transaction.amount
    }

    monthMap.set(key, entry)
  }

  return monthMap
}

export const useIncomeStore = create<IncomeStore>()(
  persist(
    immer((set) => ({
      ...initialState,
      addTransaction: (payload) => {
        const now = new Date().toISOString()

        set((state) => {
          state.transactions.unshift({
            ...payload,
            id: uuidv4(),
            createdAt: now,
            updatedAt: now,
          })
        })
      },
      updateTransaction: (id, patch) => {
        const now = new Date().toISOString()

        set((state) => {
          const transaction = state.transactions.find((item) => item.id === id)

          if (transaction) {
            Object.assign(transaction, patch)
            transaction.updatedAt = now
          }
        })
      },
      deleteTransaction: (id) => {
        set((state) => {
          state.transactions = state.transactions.filter((transaction) => transaction.id !== id)
        })
      },
      setSearchQuery: (searchQuery) => {
        set((state) => {
          state.searchQuery = searchQuery
        })
      },
    })),
    {
      name: 'mybase-income',
      storage: createZustandStorage(),
      partialize: (state) => ({
        transactions: state.transactions,
        searchQuery: state.searchQuery,
      }),
    },
  ),
)

export function getTotalIncome(transactions: Transaction[]): number {
  return transactions.filter((transaction) => transaction.type === 'income').reduce((total, transaction) => total + transaction.amount, 0)
}

export function getTotalExpenses(transactions: Transaction[]): number {
  return transactions.filter((transaction) => transaction.type === 'expense').reduce((total, transaction) => total + transaction.amount, 0)
}

export function getNetSavings(transactions: Transaction[]): number {
  return getTotalIncome(transactions) - getTotalExpenses(transactions)
}

export function getSavingsRate(transactions: Transaction[]): number {
  const totalIncome = getTotalIncome(transactions)

  if (totalIncome === 0) {
    return 0
  }

  const rate = Math.round((getNetSavings(transactions) / totalIncome) * 100)
  return Math.max(0, Math.min(100, rate))
}

export function getSavingsStatus(rate: number): string {
  if (rate >= 50) {
    return 'Healthy growth'
  }

  if (rate >= 20) {
    return 'Steady'
  }

  return 'Watch spending'
}

export function getMonthlyChartData(transactions: Transaction[]): Array<{ month: string; income: number; expenses: number }> {
  return getMonthlyWindow().map(({ key, label }) => {
    const monthTransactions = transactions.filter((transaction) => transaction.date.startsWith(key))
    const income = roundToTwoDecimals(monthTransactions.filter((transaction) => transaction.type === 'income').reduce((total, transaction) => total + transaction.amount, 0))
    const expenses = roundToTwoDecimals(monthTransactions.filter((transaction) => transaction.type === 'expense').reduce((total, transaction) => total + transaction.amount, 0))

    return {
      month: label,
      income,
      expenses,
    }
  })
}

export function getPeakIncomeMonth(data: ReturnType<typeof getMonthlyChartData>): string {
  if (data.every((item) => item.income === 0)) {
    return ''
  }

  return data.reduce((highest, current) => (current.income > highest.income ? current : highest)).month
}

export function getExpenseBreakdown(transactions: Transaction[]): Array<{ category: string; amount: number; percentage: number }> {
  const expenses = transactions.filter((transaction) => transaction.type === 'expense')
  const totalExpenses = expenses.reduce((total, transaction) => total + transaction.amount, 0)

  const categories = expenses.reduce<Map<string, number>>((map, transaction) => {
    const category = transaction.category.trim()

    if (!category) {
      return map
    }

    map.set(category, (map.get(category) ?? 0) + transaction.amount)
    return map
  }, new Map())

  return Array.from(categories.entries())
    .map(([category, amount]) => ({
      category,
      amount: roundToTwoDecimals(amount),
      percentage: totalExpenses === 0 ? 0 : Math.round((amount / totalExpenses) * 100),
    }))
    .sort((left, right) => right.amount - left.amount)
    .slice(0, 5)
}

export function getTopExpenseCategory(breakdown: ReturnType<typeof getExpenseBreakdown>): string {
  return breakdown[0]?.category ?? ''
}

export function getSavingsTrendData(transactions: Transaction[]): Array<{ month: string; savings: number }> {
  return getMonthlyWindow().map(({ key, label }) => {
    const monthTransactions = transactions.filter((transaction) => transaction.date.startsWith(key))
    const income = monthTransactions.filter((transaction) => transaction.type === 'income').reduce((total, transaction) => total + transaction.amount, 0)
    const expenses = monthTransactions.filter((transaction) => transaction.type === 'expense').reduce((total, transaction) => total + transaction.amount, 0)

    return {
      month: label,
      savings: roundToTwoDecimals(income - expenses),
    }
  })
}

export function getProjectedAnnualSavings(transactions: Transaction[]): number {
  if (transactions.length === 0) {
    return 0
  }

  const monthlyTotals = groupTransactionsByMonth(transactions)

  if (monthlyTotals.size === 0) {
    return 0
  }

  const averageMonthlySavings = Array.from(monthlyTotals.values()).reduce((total, month) => total + (month.income - month.expenses), 0) / monthlyTotals.size

  return Math.round(averageMonthlySavings * 12)
}

export function getRecentTransactions(transactions: Transaction[], limit: number): Transaction[] {
  return [...transactions]
    .sort((left, right) => right.date.localeCompare(left.date) || right.createdAt.localeCompare(left.createdAt))
    .slice(0, limit)
}

export function getAllCategories(transactions: Transaction[]): string[] {
  return Array.from(
    new Set(
      transactions
        .map((transaction) => transaction.category.trim())
        .filter((category) => category.length > 0),
    ),
  ).sort((left, right) => left.localeCompare(right))
}

export function getFilteredTransactions(transactions: Transaction[], search: string): Transaction[] {
  const lowered = search.trim().toLowerCase()

  return [...transactions]
    .filter((transaction) => {
      if (!lowered) {
        return true
      }

      return transaction.description.toLowerCase().includes(lowered) || transaction.category.toLowerCase().includes(lowered)
    })
    .sort((left, right) => right.date.localeCompare(left.date) || right.createdAt.localeCompare(left.createdAt))
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
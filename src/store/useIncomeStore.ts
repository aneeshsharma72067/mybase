import { getMonth, getYear, parseISO } from 'date-fns'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { createZustandStorage } from '../lib/storage'
import { generateId } from '../lib/utils'
import type { IncomeStoreState, Transaction } from '../types/income.types'

type IncomeStoreActions = {
  addTransaction: (tx: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, patch: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  addCategory: (name: string) => void
}

export type IncomeStore = IncomeStoreState & IncomeStoreActions

const initialState: IncomeStoreState = {
  transactions: [],
  categories: [],
}

function isSameMonth(dateValue: string, year: number, month: number): boolean {
  const parsedDate = parseISO(dateValue)
  return getYear(parsedDate) === year && getMonth(parsedDate) + 1 === month
}

function getTransactionsForMonth(year: number, month: number): Transaction[] {
  return useIncomeStore
    .getState()
    .transactions.filter((transaction) => isSameMonth(transaction.date, year, month))
}

export const useIncomeStore = create<IncomeStore>()(
  persist(
    immer((set) => ({
      ...initialState,
      addTransaction: (tx) => {
        set((state) => {
          state.transactions.push({
            ...tx,
            id: generateId(),
          })

          if (!state.categories.includes(tx.category)) {
            state.categories.push(tx.category)
          }
        })
      },
      updateTransaction: (id, patch) => {
        set((state) => {
          const transaction = state.transactions.find((item) => item.id === id)

          if (transaction) {
            Object.assign(transaction, patch)
          }
        })
      },
      deleteTransaction: (id) => {
        set((state) => {
          state.transactions = state.transactions.filter((transaction) => transaction.id !== id)
        })
      },
      addCategory: (name) => {
        set((state) => {
          if (!state.categories.includes(name)) {
            state.categories.push(name)
          }
        })
      },
    })),
    {
      name: 'mybase-income',
      storage: createZustandStorage(),
      partialize: (state) => ({
        transactions: state.transactions,
        categories: state.categories,
      }),
    },
  ),
)

export function getByMonth(year: number, month: number): Transaction[] {
  return getTransactionsForMonth(year, month)
}

export function getTotalIncome(year: number, month: number): number {
  return getTransactionsForMonth(year, month)
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0)
}

export function getTotalExpenses(year: number, month: number): number {
  return getTransactionsForMonth(year, month)
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0)
}

export function getNetBalance(year: number, month: number): number {
  return getTotalIncome(year, month) - getTotalExpenses(year, month)
}
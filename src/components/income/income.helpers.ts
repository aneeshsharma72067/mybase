import { format, parseISO, subMonths } from 'date-fns'
import type { Transaction, TransactionType } from '../../types/income.types'

export interface DraftTransaction {
  type: TransactionType
  amount: string
  category: string
  label: string
  date: string
  notes: string
}

export interface IncomeSummary {
  totalIncome: number
  totalExpenses: number
  netSavings: number
  savingsRate: number
}

export const initialDraftTransaction: DraftTransaction = {
  type: 'income',
  amount: '',
  category: '',
  label: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  notes: '',
}

export function createSeedTransactions(): Array<Omit<Transaction, 'id'>> {
  const now = new Date()
  const makeDate = (offset: number, day: number) => format(new Date(subMonths(now, offset).getFullYear(), subMonths(now, offset).getMonth(), day), 'yyyy-MM-dd')

  return [
    { type: 'income', amount: 4200, category: 'Freelance', label: 'Client Project Alpha', date: makeDate(0, 24), notes: 'Milestone payment' },
    { type: 'expense', amount: 154.2, category: 'Groceries', label: 'Whole Foods Market', date: makeDate(0, 22), notes: 'Weekly groceries' },
    { type: 'income', amount: 8250, category: 'Primary', label: 'Monthly Salary', date: makeDate(0, 20), notes: 'Main paycheck' },
    { type: 'expense', amount: 120, category: 'Wellness', label: 'Forest Yoga Studio', date: makeDate(0, 18), notes: 'Monthly pass' },
    { type: 'expense', amount: 1800, category: 'Housing', label: 'Rent Payment', date: makeDate(1, 1), notes: 'Apartment' },
    { type: 'expense', amount: 220, category: 'Sustenance', label: 'Kitchen Supplies', date: makeDate(1, 11), notes: 'Bulk supplies' },
    { type: 'income', amount: 3900, category: 'Freelance', label: 'Brand Retainer', date: makeDate(1, 14), notes: 'Monthly retainer' },
    { type: 'income', amount: 8000, category: 'Primary', label: 'Monthly Salary', date: makeDate(1, 20), notes: 'Main paycheck' },
    { type: 'expense', amount: 1450, category: 'Housing', label: 'Rent Payment', date: makeDate(2, 1), notes: 'Apartment' },
    { type: 'income', amount: 7600, category: 'Primary', label: 'Monthly Salary', date: makeDate(2, 20), notes: 'Main paycheck' },
    { type: 'income', amount: 3100, category: 'Freelance', label: 'Consulting Sprint', date: makeDate(3, 17), notes: 'Consulting' },
    { type: 'expense', amount: 2100, category: 'Housing', label: 'Rent Payment', date: makeDate(3, 1), notes: 'Apartment' },
  ]
}

export function calculateSummary(transactions: Transaction[]): IncomeSummary {
  const totalIncome = transactions.filter((tx) => tx.type === 'income').reduce((total, tx) => total + tx.amount, 0)
  const totalExpenses = transactions.filter((tx) => tx.type === 'expense').reduce((total, tx) => total + tx.amount, 0)
  const netSavings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

export function getRecentMonths(transactions: Transaction[], count = 6): Array<{ monthLabel: string; income: number; expense: number }> {
  const now = new Date()

  return Array.from({ length: count }).map((_, index) => {
    const date = subMonths(now, count - 1 - index)
    const month = date.getMonth()
    const year = date.getFullYear()

    const monthTransactions = transactions.filter((tx) => {
      const parsed = parseISO(tx.date)
      return parsed.getMonth() === month && parsed.getFullYear() === year
    })

    return {
      monthLabel: format(date, 'MMM'),
      income: monthTransactions.filter((tx) => tx.type === 'income').reduce((total, tx) => total + tx.amount, 0),
      expense: monthTransactions.filter((tx) => tx.type === 'expense').reduce((total, tx) => total + tx.amount, 0),
    }
  })
}

export function getExpenseBreakdown(transactions: Transaction[]) {
  const expenses = transactions.filter((tx) => tx.type === 'expense')
  const total = expenses.reduce((sum, tx) => sum + tx.amount, 0)

  const buckets = expenses.reduce<Record<string, number>>((acc, tx) => {
    acc[tx.category] = (acc[tx.category] ?? 0) + tx.amount
    return acc
  }, {})

  const rows = Object.entries(buckets)
    .map(([category, amount]) => ({
      category,
      amount,
      percent: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)

  return {
    total,
    rows,
    topCategory: rows[0]?.category ?? 'None',
  }
}

export function getProjectedSavings(monthlyData: Array<{ income: number; expense: number }>): number {
  const recent = monthlyData.slice(-3)

  if (recent.length === 0) {
    return 0
  }

  const recentNet = recent.reduce((total, month) => total + (month.income - month.expense), 0) / recent.length
  return recentNet * 12
}
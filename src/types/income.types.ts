export type TransactionType = 'income' | 'expense'

export type Category = string

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: Category
  label: string
  date: string
  notes?: string
}

export interface IncomeStoreState {
  transactions: Transaction[]
  categories: string[]
}
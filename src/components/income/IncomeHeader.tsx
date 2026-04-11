import { Plus, Search } from 'lucide-react'

interface IncomeHeaderProps {
  searchValue: string
  onSearchValueChange: (value: string) => void
  onLogIncome: () => void
  onLogExpense: () => void
  onAddTransaction: () => void
}

export function IncomeHeader({
  searchValue,
  onSearchValueChange,
  onLogIncome,
  onLogExpense,
  onAddTransaction,
}: IncomeHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-black tracking-tight text-primary lg:text-5xl">Income Sanctuary</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Tracking your wealth flow with peace of mind.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 rounded-full bg-surface-container-lowest px-3 py-2 text-on-surface-variant shadow-sm">
          <Search size={15} />
          <input
            value={searchValue}
            onChange={(event) => onSearchValueChange(event.target.value)}
            placeholder="Search financials..."
            className="w-44 bg-transparent text-sm outline-none lg:w-64"
          />
        </label>

        <button
          type="button"
          onClick={onLogIncome}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary shadow-sm hover:bg-primary-dim"
        >
          <Plus size={14} /> Log Income
        </button>

        <button
          type="button"
          onClick={onLogExpense}
          className="inline-flex items-center gap-2 rounded-full border border-outline/20 bg-surface-container-lowest px-5 py-2 text-sm font-semibold text-primary hover:bg-surface-container"
        >
          <Plus size={14} /> Log Expense
        </button>

        <button
          type="button"
          onClick={onAddTransaction}
          className="inline-flex items-center gap-2 rounded-full bg-primary-container px-5 py-2 text-sm font-semibold text-on-primary-container hover:bg-primary-fixed"
        >
          <Plus size={14} /> Add Transaction
        </button>
      </div>
    </header>
  )
}
import { ArrowDownRight, ArrowUpRight, Leaf, PiggyBank } from 'lucide-react'
import { formatCurrency } from './income.helpers'

interface IncomeSummaryCardsProps {
  totalIncome: number
  totalExpenses: number
  netSavings: number
  savingsRate: number
}

export function IncomeSummaryCards({ totalIncome, totalExpenses, netSavings, savingsRate }: IncomeSummaryCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-4">
      <div className="rounded-3xl border border-primary/10 bg-surface-container-lowest p-6">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-primary">
          <ArrowUpRight size={16} />
        </span>
        <p className="text-sm font-medium text-on-surface-variant">Total Income</p>
        <h3 className="mt-1 text-2xl font-bold text-primary">{formatCurrency(totalIncome)}</h3>
        <p className="mt-4 text-xs font-bold text-primary">Live from transaction feed</p>
      </div>
      <div className="rounded-3xl border border-primary/10 bg-surface-container-lowest p-6">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary-container text-secondary">
          <ArrowDownRight size={16} />
        </span>
        <p className="text-sm font-medium text-on-surface-variant">Total Expenses</p>
        <h3 className="mt-1 text-2xl font-bold text-secondary">{formatCurrency(totalExpenses)}</h3>
        <p className="mt-4 text-xs font-bold text-on-surface-variant">Spend visibility</p>
      </div>
      <div className="rounded-3xl bg-linear-to-br from-primary to-primary-dim p-6 text-on-primary">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-on-primary">
          <Leaf size={16} />
        </span>
        <p className="text-sm font-medium opacity-80">Net Savings</p>
        <h3 className="mt-1 text-2xl font-bold">{formatCurrency(netSavings)}</h3>
        <p className="mt-4 text-xs font-bold opacity-90">Healthy growth</p>
      </div>
      <div className="rounded-3xl border border-primary/10 bg-surface-container-lowest p-6">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-tertiary-container text-tertiary">
          <PiggyBank size={16} />
        </span>
        <p className="text-sm font-medium text-on-surface-variant">Savings Rate</p>
        <h3 className="mt-1 text-2xl font-bold text-tertiary">{savingsRate.toFixed(1)}%</h3>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
          <div className="h-full rounded-full bg-tertiary" style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }} />
        </div>
      </div>
    </section>
  )
}
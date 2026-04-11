import { formatCurrency } from './income.helpers'

interface ExpenseBreakdownRow {
  category: string
  amount: number
  percent: number
}

interface ExpenseBreakdownCardProps {
  topCategory: string
  rows: ExpenseBreakdownRow[]
}

const tones = ['bg-primary', 'bg-secondary', 'bg-tertiary', 'bg-error', 'bg-outline']

export function ExpenseBreakdownCard({ topCategory, rows }: ExpenseBreakdownCardProps) {
  return (
    <div className="rounded-3xl bg-surface-container-lowest p-6">
      <h4 className="mb-6 font-display text-lg font-bold">Expense Breakdown</h4>

      <div className="flex items-center justify-center py-4">
        <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-surface-container">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-outline">Top</span>
            <p className="text-lg font-black text-primary">{topCategory}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {rows.slice(0, 3).map((row, index) => (
          <div key={row.category} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={['h-2 w-2 rounded-full', tones[index % tones.length]].join(' ')} />
              {row.category}
            </div>
            <span className="font-bold">{row.percent.toFixed(0)}% ({formatCurrency(row.amount)})</span>
          </div>
        ))}
      </div>
    </div>
  )
}
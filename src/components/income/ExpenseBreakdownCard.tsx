import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../../store/useIncomeStore'

interface ExpenseBreakdownRow {
  category: string
  amount: number
  percentage: number
}

interface ExpenseBreakdownCardProps {
  breakdown: ExpenseBreakdownRow[]
  topCategory: string
}

function getCategoryColor(category: string): string {
  const normalized = category.trim().toLowerCase()

  if (normalized === 'housing') {
    return '#2d5a3d'
  }

  if (normalized === 'groceries') {
    return '#1a3a5c'
  }

  if (normalized === 'sustenance') {
    return '#4a3728'
  }

  if (normalized === 'wellness') {
    return '#4a2d5c'
  }

  if (normalized === 'transport') {
    return '#3d4a2d'
  }

  if (normalized === 'utilities') {
    return '#2d3d4a'
  }

  return '#3d7a5c'
}

export function ExpenseBreakdownCard({ breakdown, topCategory }: ExpenseBreakdownCardProps) {
  const chartData = breakdown.length > 0 ? breakdown : [{ category: 'empty', amount: 1, percentage: 100 }]
  const centerLabel = breakdown.length > 0 ? topCategory : 'No expenses yet'

  return (
    <div className="rounded-3xl bg-surface-container-lowest p-6">
      <h4 className="mb-6 font-display text-lg font-bold">Expense Breakdown</h4>

      <div className="flex items-center justify-center py-4">
        <div className="relative h-40 w-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="amount" innerRadius={46} outerRadius={78} stroke="none">
                {chartData.map((item) => (
                  <Cell key={item.category} fill={item.category === 'empty' ? '#d6dbd4' : getCategoryColor(item.category)} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-outline">TOP</span>
              <p className="text-lg font-black text-primary">{centerLabel}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {breakdown.map((row) => (
          <div key={row.category} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: getCategoryColor(row.category) }} />
              {row.category}
            </div>
            <span className="font-bold">{row.percentage}% ({formatCurrency(row.amount)})</span>
          </div>
        ))}
      </div>
    </div>
  )
}
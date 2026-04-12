import { Line, LineChart, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../../store/useIncomeStore'

interface SavingsTrendCardProps {
  trendData: Array<{ month: string; savings: number }>
  projectedSavings: number
}

export function SavingsTrendCard({ trendData, projectedSavings }: SavingsTrendCardProps) {
  const nonZeroMonths = trendData.filter((item) => item.savings !== 0)
  const displayData = nonZeroMonths.length <= 1 && trendData.length > 0
    ? trendData.map((item) => ({ ...item, savings: nonZeroMonths[0]?.savings ?? 0 }))
    : trendData

  return (
    <div className="rounded-3xl bg-emerald-900 p-6 text-on-primary">
      <div className="mb-4 flex items-start justify-between">
        <h4 className="font-display text-lg font-bold">Savings Trend</h4>
        <span className="text-sm opacity-70">↗</span>
      </div>

      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
            <Line type="monotone" dataKey="savings" stroke="white" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-[10px] uppercase tracking-widest opacity-70">PROJECTED SAVINGS: {formatCurrency(projectedSavings)} / YEAR</p>
    </div>
  )
}
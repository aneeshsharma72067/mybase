import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts'

interface IncomeVsExpensesChartProps {
  data: Array<{ month: string; income: number; expenses: number }>
  peakMonth: string
}

function formatAxisTick(value: number): string {
  return `₹${Math.round(value / 1000)}k`
}

export function IncomeVsExpensesChart({ data, peakMonth }: IncomeVsExpensesChartProps) {
  return (
    <section className="rounded-3xl bg-surface-container-lowest p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-display text-xl font-bold text-on-surface">Monthly Income vs Expenses</h4>
          <p className="text-sm text-on-surface-variant">Performance for the last 6 months</p>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-xs font-medium">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-secondary-container" />
            <span className="text-xs font-medium">Expenses</span>
          </div>
        </div>
      </div>

      <div className="h-64 border-b border-surface-variant px-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 0, left: -10, bottom: 0 }} barCategoryGap={16}>
            <CartesianGrid vertical={false} stroke="var(--color-outline-variant)" strokeOpacity={0.18} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} interval={0} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12, fontWeight: 600 }} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={formatAxisTick} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12, fontWeight: 600 }} />
            {peakMonth ? <ReferenceLine x={peakMonth} stroke="transparent" label={{ value: 'Peak Month', position: 'top', fill: 'var(--color-primary)', fontSize: 10, fontWeight: 700 }} /> : null}
            <Bar dataKey="income" fill="var(--color-primary)" radius={[8, 8, 0, 0]} barSize={18} />
            <Bar dataKey="expenses" fill="var(--color-secondary-container)" radius={[8, 8, 0, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
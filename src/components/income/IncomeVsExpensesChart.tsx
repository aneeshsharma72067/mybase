interface IncomeVsExpensesChartProps {
  data: Array<{ monthLabel: string; income: number; expense: number }>
}

export function IncomeVsExpensesChart({ data }: IncomeVsExpensesChartProps) {
  const max = Math.max(1, ...data.map((item) => Math.max(item.income, item.expense)))
  const peakIndex = data.findIndex((item) => item.income === Math.max(...data.map((month) => month.income)))

  return (
    <section className="rounded-3xl bg-surface-container-lowest p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-display text-xl font-bold text-on-surface">Monthly Income vs Expenses</h4>
          <p className="text-sm text-on-surface-variant">Performance for the last 6 months</p>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-primary" /><span className="text-xs font-medium">Income</span></div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-secondary-container" /><span className="text-xs font-medium">Expenses</span></div>
        </div>
      </div>

      <div className="h-64 border-b border-surface-variant px-4">
        <div className="flex h-full items-end justify-between gap-4">
          {data.map((month, index) => (
            <div key={month.monthLabel} className="relative flex h-full flex-1 items-end justify-center gap-1">
              <div className="w-6 rounded-t-lg bg-primary" style={{ height: `${(month.income / max) * 100}%` }} />
              <div className="w-6 rounded-t-lg bg-secondary-container" style={{ height: `${(month.expense / max) * 100}%` }} />
              {index === peakIndex ? <span className="absolute -top-6 text-[10px] font-bold text-primary">Peak Month</span> : null}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-between px-4 text-xs font-medium text-outline">
        {data.map((month) => (
          <span key={month.monthLabel} className="flex-1 text-center">{month.monthLabel}</span>
        ))}
      </div>
    </section>
  )
}
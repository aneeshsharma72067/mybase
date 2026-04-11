import { TrendingUp } from 'lucide-react'

interface IncomeSummaryCardProps {
  amount: string
  growth: string
  targetProgress: number
}

export function IncomeSummaryCard({ amount, growth, targetProgress }: IncomeSummaryCardProps) {
  return (
    <section className="rounded-xl bg-surface-container-lowest p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Income Summary</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary-container px-3 py-1 text-xs font-bold text-primary">
          <TrendingUp size={14} />
          <span>Uptrend</span>
        </span>
      </div>

      <div className="mt-6 flex items-end gap-3">
        <p className="font-display text-4xl font-black text-on-surface">{amount}</p>
        <p className="pb-1 text-sm font-bold text-primary">{growth}</p>
      </div>

      <div className="mt-6 h-2 rounded-full bg-surface-container-high">
        <div className="h-2 rounded-full bg-primary" style={{ width: `${targetProgress}%` }} />
      </div>

      <p className="mt-3 text-sm text-on-surface-variant">{targetProgress}% of monthly target reached</p>
    </section>
  )
}
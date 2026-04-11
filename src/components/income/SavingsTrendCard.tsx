interface SavingsTrendCardProps {
  projectedSavings: number
}

export function SavingsTrendCard({ projectedSavings }: SavingsTrendCardProps) {
  return (
    <div className="rounded-3xl bg-emerald-900 p-6 text-on-primary">
      <div className="mb-4 flex items-start justify-between">
        <h4 className="font-display text-lg font-bold">Savings Trend</h4>
        <span className="text-sm opacity-70">↗</span>
      </div>

      <div className="h-24">
        <svg viewBox="0 0 100 40" className="h-full w-full fill-none stroke-on-primary stroke-2">
          <path d="M0,35 Q10,32 20,25 T40,15 T60,20 T80,5 T100,10" strokeLinecap="round" />
          <path d="M0,35 Q10,32 20,25 T40,15 T60,20 T80,5 T100,10 V40 H0 Z" fill="url(#income-grad)" fillOpacity="0.2" stroke="none" />
          <defs>
            <linearGradient id="income-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <p className="mt-4 text-[10px] uppercase tracking-widest opacity-70">Projected savings: ${projectedSavings.toFixed(0)} / year</p>
    </div>
  )
}
import { ShieldCheck } from 'lucide-react'

interface SecurityHealthCardProps {
  securePercent: number
  strong: number
  fair: number
  weak: number
  total: number
}

export function SecurityHealthCard({ securePercent, strong, fair, weak, total }: SecurityHealthCardProps) {
  return (
    <section className="rounded-xl bg-surface-container-lowest p-6">
      <h3 className="mb-5 flex items-center gap-2 font-display text-xl font-bold text-on-surface">
        <ShieldCheck size={18} className="text-primary" /> Security Health
      </h3>

      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold">Status: Flourishing</span>
        <span className="font-bold text-primary">{securePercent}%</span>
      </div>

      <div className="mb-6 flex h-3 overflow-hidden rounded-full bg-surface-container">
        <div className="h-full bg-primary" style={{ width: `${Math.round((strong / total) * 100)}%` }} />
        <div className="h-full bg-secondary" style={{ width: `${Math.round((fair / total) * 100)}%` }} />
        <div className="h-full bg-error" style={{ width: `${Math.round((weak / total) * 100)}%` }} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-3 text-sm">
          <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-primary" />Secure</span>
          <span className="font-bold">{strong}</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-3 text-sm">
          <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-secondary" />Fair Strength</span>
          <span className="font-bold">{fair}</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-3 text-sm">
          <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-error" />At Risk</span>
          <span className="font-bold">{weak}</span>
        </div>
      </div>
    </section>
  )
}
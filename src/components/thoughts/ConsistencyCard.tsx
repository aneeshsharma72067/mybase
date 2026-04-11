import { Activity } from 'lucide-react'

interface ConsistencyCardProps {
  progress: number
  summary: string
}

export function ConsistencyCard({ progress, summary }: ConsistencyCardProps) {
  return (
    <section className="rounded-xl border border-primary/10 bg-primary/5 p-6">
      <div className="mb-4 flex items-center gap-2">
        <Activity size={16} className="text-primary" />
        <h4 className="text-xs font-black uppercase tracking-[0.18em] text-primary">Consistency</h4>
      </div>

      <div className="mb-3 flex items-center justify-between text-xs">
        <span className="font-medium text-on-surface-variant">Weekly Goal</span>
        <span className="font-bold text-primary">{progress}%</span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-surface-variant">
        <div className="h-1.5 rounded-full bg-primary" style={{ width: `${progress}%` }} />
      </div>

      <p className="mt-4 text-xs leading-relaxed text-on-surface-variant">{summary}</p>
    </section>
  )
}
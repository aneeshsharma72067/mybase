import { Activity } from 'lucide-react'
import { format, startOfMonth } from 'date-fns'
import { useMemo } from 'react'
import { useThoughtsStore } from '../../store/useThoughtsStore'

export function ConsistencyCard() {
  const { thoughts } = useThoughtsStore()
  const monthStart = startOfMonth(new Date())
  const monthLabel = format(monthStart, 'MMMM')

  const thisMonthCount = useMemo(() => {
    return thoughts.filter((thought) => new Date(thought.createdAt) >= monthStart).length
  }, [monthStart, thoughts])

  return (
    <section className="rounded-xl border border-primary/10 bg-primary/5 p-6">
      <div className="mb-4 flex items-center gap-2">
        <Activity size={16} className="text-primary" />
        <h4 className="text-xs font-black uppercase tracking-[0.18em] text-primary">Consistency</h4>
      </div>

      <p className="text-sm font-semibold text-on-surface">
        <span className="text-2xl font-black text-primary">{thisMonthCount}</span> thoughts in {monthLabel}
      </p>

      <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
        Keep the rhythm going with short, regular capture sessions.
      </p>
    </section>
  )
}
import { Lightbulb } from 'lucide-react'

interface TodoInsightCardProps {
  quoteText: string
  attribution?: string
}

export function TodoInsightCard({ quoteText, attribution }: TodoInsightCardProps) {
  return (
    <section className="rounded-xl bg-primary-container/30 p-6">
      <div className="mb-3 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-primary">
          <Lightbulb size={16} />
        </span>
        <h4 className="font-display text-lg font-bold text-on-primary-container">Biophilic Insight</h4>
      </div>
      <p className="text-sm leading-relaxed text-on-primary-container/85">{quoteText}</p>
      {attribution ? (
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-on-primary-container/70">{attribution}</p>
      ) : null}
    </section>
  )
}
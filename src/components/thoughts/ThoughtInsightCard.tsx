import { Lightbulb } from 'lucide-react'

interface ThoughtInsightCardProps {
  title: string
  body: string
  dateLabel: string
  tags: string[]
}

export function ThoughtInsightCard({ title, body, dateLabel, tags }: ThoughtInsightCardProps) {
  return (
    <article className="space-y-6 rounded-xl bg-surface-container-lowest p-8 transition-colors hover:bg-surface-container">
      <div className="flex items-start justify-between">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-tertiary-container text-on-tertiary-container">
          <Lightbulb size={18} />
        </span>
        <span className="text-xs font-semibold text-on-surface-variant/50">{dateLabel}</span>
      </div>

      <div className="space-y-3">
        <h3 className="font-display text-2xl font-bold text-on-surface">{title}</h3>
        <p className="text-sm leading-relaxed text-on-surface-variant">{body}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-surface-container-high px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-outline"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  )
}
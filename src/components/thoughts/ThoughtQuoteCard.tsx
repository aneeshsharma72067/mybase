import { Quote } from 'lucide-react'

interface ThoughtQuoteCardProps {
  quote: string
  authorLabel: string
  note: string
  dateLabel: string
  tags: string[]
}

export function ThoughtQuoteCard({ quote, authorLabel, note, dateLabel, tags }: ThoughtQuoteCardProps) {
  return (
    <article className="flex flex-col justify-between rounded-xl bg-linear-to-br from-secondary-container to-tertiary-container p-8">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Quote className="text-on-secondary-container/60" size={20} />
          <span className="text-xs font-semibold text-on-surface-variant/50">{dateLabel}</span>
        </div>
        <p className="font-display text-2xl font-bold italic text-on-secondary-container">{quote}</p>
      </div>

      <div className="mt-8 space-y-4 border-t border-on-secondary-container/20 pt-6">
        {tags.length > 0 ? (
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
        ) : null}

        <div>
          <p className="text-sm font-bold text-on-secondary-container">{authorLabel}</p>
          <p className="text-xs text-on-secondary-container/70">{note}</p>
        </div>
      </div>
    </article>
  )
}
import { Quote } from 'lucide-react'

interface ThoughtQuoteCardProps {
  quote: string
  authorLabel: string
  note: string
  imageUrl: string
}

export function ThoughtQuoteCard({ quote, authorLabel, note, imageUrl }: ThoughtQuoteCardProps) {
  return (
    <article className="flex flex-col justify-between rounded-xl bg-linear-to-br from-secondary-container to-tertiary-container p-8">
      <div className="space-y-4">
        <Quote className="text-on-secondary-container/60" size={20} />
        <p className="font-display text-2xl font-bold italic text-on-secondary-container">{quote}</p>
      </div>

      <div className="mt-8 flex items-center gap-3 border-t border-on-secondary-container/20 pt-6">
        <img src={imageUrl} alt="Avatar" className="h-8 w-8 rounded-full object-cover" />
        <div>
          <p className="text-sm font-bold text-on-secondary-container">{authorLabel}</p>
          <p className="text-xs text-on-secondary-container/70">{note}</p>
        </div>
      </div>
    </article>
  )
}
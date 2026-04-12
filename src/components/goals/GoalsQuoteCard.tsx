import { Leaf } from 'lucide-react'
import { useThoughtsStore } from '../../store/useThoughtsStore'

export function GoalsQuoteCard() {
  const pinnedQuote = useThoughtsStore((state) => state.thoughts.find((thought) => thought.type === 'quote' && thought.isPinned))
  const quote = pinnedQuote?.quoteText?.trim() || 'Pin a quote in Thoughts to surface it here.'
  const author = pinnedQuote?.attribution?.trim() ? `— ${pinnedQuote.attribution.trim()}` : ''

  return (
    <article className="flex h-80 flex-col items-center justify-center rounded-xl bg-secondary p-8 text-center text-on-secondary lg:h-96">
      <Leaf size={52} className="mb-5 opacity-60" />
      <p className="font-display text-2xl font-black leading-tight">{quote}</p>
      <p className="mt-5 text-sm italic opacity-75">{author}</p>
    </article>
  )
}
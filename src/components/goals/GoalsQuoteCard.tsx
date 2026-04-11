import { Leaf } from 'lucide-react'

interface GoalsQuoteCardProps {
  quote: string
  author: string
}

export function GoalsQuoteCard({ quote, author }: GoalsQuoteCardProps) {
  return (
    <article className="flex h-80 flex-col items-center justify-center rounded-xl bg-secondary p-8 text-center text-on-secondary lg:h-96">
      <Leaf size={52} className="mb-5 opacity-60" />
      <p className="font-display text-2xl font-black leading-tight">{quote}</p>
      <p className="mt-5 text-sm italic opacity-75">{author}</p>
    </article>
  )
}
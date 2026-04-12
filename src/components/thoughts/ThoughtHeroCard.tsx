import { Share2 } from 'lucide-react'

interface ThoughtHeroCardProps {
  title: string
  body: string
  date: string
  backgroundImage: string
  onContinue: () => void
  onShare: () => void
}

export function ThoughtHeroCard({
  title,
  body,
  date,
  backgroundImage,
  onContinue,
  onShare,
}: ThoughtHeroCardProps) {
  return (
    <article className="relative min-h-105 overflow-hidden rounded-xl p-8 lg:p-12">
      <img src={backgroundImage} alt="Forest scene" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-linear-to-t from-primary-dim/90 via-primary-dim/40 to-transparent" />

      <div className="relative z-10 mt-20 space-y-4 text-on-primary lg:mt-24">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-primary-container/25 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary-fixed">
            Reflection
          </span>
          <span className="self-center text-xs font-medium text-on-primary/70">{date}</span>
        </div>

        <h2 className="font-display text-3xl font-black leading-tight lg:text-5xl">{title}</h2>
        <p className="max-w-2xl text-sm leading-7 text-on-primary/85 lg:text-lg">{body}</p>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onContinue}
            className="rounded-full bg-surface-container-lowest px-6 py-3 text-sm font-bold text-primary hover:bg-surface"
          >
            Continue Writing
          </button>
          <button
            type="button"
            onClick={onShare}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-lowest/20 text-on-primary hover:bg-surface-container-lowest/30"
            aria-label="Share thought"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}
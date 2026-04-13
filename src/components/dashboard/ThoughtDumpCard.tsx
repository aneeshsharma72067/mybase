import { Brain, NotebookPen } from 'lucide-react'

interface ThoughtDumpCardProps {
  title: string
  body: string
  onExpand: () => void
  onQuickNote: () => void
}

export function ThoughtDumpCard({ title, body, onExpand, onQuickNote }: ThoughtDumpCardProps) {
  return (
    <section className="relative overflow-hidden rounded-xl bg-linear-to-br from-secondary via-primary to-primary p-6 lg:p-10">
      <div className="relative z-10">
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-lowest/50 text-on-primary-container">
          <Brain size={20} />
        </div>
        <h2 className="font-display text-2xl font-black text-on-primary lg:text-4xl">{title}</h2>
        <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-on-primary lg:text-lg">
          {body}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onExpand}
            className="rounded-full bg-on-secondary-container px-5 py-3 text-sm font-bold text-on-primary transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            Expand Reflection
          </button>
          <button
            type="button"
            onClick={onQuickNote}
            className="inline-flex items-center gap-2 rounded-full bg-on-primary px-5 py-3 text-sm font-bold text-on-surface-container-lowest transition-colors hover:bg-surface-container-lowest/70"
          >
            <NotebookPen size={16} />
            <span>Quick Note</span>
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-24 -right-12 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
    </section>
  )
}
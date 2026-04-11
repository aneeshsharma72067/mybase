import { Plus } from 'lucide-react'

interface NewGoalCardProps {
  onCreate: () => void
}

export function NewGoalCard({ onCreate }: NewGoalCardProps) {
  return (
    <button
      type="button"
      onClick={onCreate}
      className="group flex h-80 flex-col items-center justify-center gap-4 rounded-xl border-4 border-dashed border-outline-variant/30 transition-all hover:border-primary/40 hover:text-primary lg:h-96"
    >
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-surface-container transition-colors group-hover:bg-primary-container">
        <Plus size={28} />
      </span>
      <span className="font-display text-xl font-bold">New Vision</span>
    </button>
  )
}
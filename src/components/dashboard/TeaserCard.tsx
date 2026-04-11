import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'

interface TeaserCardProps {
  title: string
  subtitle: string
  icon: LucideIcon
  onClick: () => void
}

export function TeaserCard({ title, subtitle, icon: Icon, onClick }: TeaserCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-xl bg-surface-container p-5 text-left transition-all hover:bg-surface-container-high hover:shadow-sm active:scale-[0.99]"
    >
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-lowest text-primary">
        <Icon size={20} />
      </div>

      <div>
        <p className="text-lg font-bold text-on-surface">{title}</p>
        <p className="text-sm text-on-surface-variant">{subtitle}</p>
      </div>

      <span className="ml-auto text-on-surface-variant">
        <ArrowRight size={16} />
      </span>
    </button>
  )
}
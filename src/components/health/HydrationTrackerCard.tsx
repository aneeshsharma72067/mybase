import { Droplets } from 'lucide-react'
import { formatWaterLitres } from '../../store/useHealthStore'

interface HydrationTrackerCardProps {
  targetGlasses: number
  currentGlasses: number
  onGlassClick: (index: number, isActive: boolean) => void
}

export function HydrationTrackerCard({
  targetGlasses,
  currentGlasses,
  onGlassClick,
}: HydrationTrackerCardProps) {
  return (
    <section className="rounded-[2.25rem] flex-1 bg-surface-container-lowest p-8 shadow-[0_10px_24px_rgba(22,29,24,0.04)] ring-1 ring-black/5">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-on-surface">Hydration Sanctuary</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Maintain your internal spring.</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: targetGlasses }).map((_, index) => {
          const filled = index < currentGlasses

          return (
            <button
              key={index}
              type="button"
              onClick={() => onGlassClick(index, filled)}
              className={[
                'flex aspect-square items-center justify-center rounded-2xl transition-colors',
                filled ? 'bg-blue-500 text-white shadow-[0_8px_20px_rgba(59,130,246,0.2)]' : 'bg-surface-container-highest text-surface-container-highest',
              ].join(' ')}
            >
              <Droplets size={18} className={filled ? 'fill-current' : 'text-stone-300'} />
            </button>
          )
        })}
      </div>

      <div className="mt-6 border-t border-stone-100 pt-5">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-bold text-on-surface">{formatWaterLitres(currentGlasses)} drank</div>
          <div className="text-xs text-on-surface-variant">Target: {formatWaterLitres(targetGlasses)}</div>
        </div>
      </div>
    </section>
  )
}

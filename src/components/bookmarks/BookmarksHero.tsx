import { ArrowRight } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { getGradientForCategory } from '../../store/useBookmarksStore'
import type { Bookmark } from '../../types/bookmark.types'

interface BookmarksHeroProps {
  heroBookmark?: Bookmark
  distribution: Array<{ category: string; count: number; percentage: number }>
  totalCount: number
  onOpenHero: () => void
}

function getDistributionColor(category: string): string {
  const normalized = category.trim().toLowerCase()

  if (normalized === 'design') {
    return '#2d8a56'
  }

  if (normalized === 'tech') {
    return '#1a5c8a'
  }

  if (normalized === 'research') {
    return '#8a5c2d'
  }

  if (normalized === 'reference') {
    return '#5c5c2d'
  }

  if (normalized === 'personal') {
    return '#6b2d8a'
  }

  return '#3d7a5c'
}

export function BookmarksHero({ heroBookmark, distribution, totalCount, onOpenHero }: BookmarksHeroProps) {
  const chartData = distribution.length > 0 ? distribution : [{ category: 'empty', count: 1, percentage: 100 }]
  const heroDescription = heroBookmark
    ? heroBookmark.description?.trim() || heroBookmark.notes?.trim() || 'No description'
    : ''
  const heroBackground = heroBookmark
    ? heroBookmark.coverImage
      ? { backgroundImage: `url(${heroBookmark.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { background: getGradientForCategory(heroBookmark.category) }
    : undefined

  return (
    <div className="grid grid-cols-12 gap-8 mb-12">
      <div className="col-span-12 lg:col-span-4 rounded-xl bg-surface-container-lowest p-10 text-center">
        <h3 className="mb-8 font-display text-lg font-bold text-on-surface">Category Distribution</h3>
        <div className="mx-auto mb-8 h-40 w-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="count" innerRadius={46} outerRadius={78} stroke="none">
                {chartData.map((item) => (
                  <Cell
                    key={item.category}
                    fill={item.category === 'empty' ? '#d6dbd4' : getDistributionColor(item.category)}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="-mt-24 flex h-24 w-full items-center justify-center">
            <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-surface-container-lowest">
              <span className="text-2xl font-black text-primary">{totalCount}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-outline">TOTAL</span>
            </div>
          </div>
        </div>
        <div className="space-y-2 text-xs font-bold">
          {(distribution.length > 0 ? distribution : [{ category: 'No data', percentage: 0 }]).map((item) => (
            <div key={item.category} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-on-surface-variant">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.category === 'No data' ? '#d6dbd4' : getDistributionColor(item.category) }}
                />
                {item.category}
              </span>
              <span className="text-on-surface">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {heroBookmark ? (
        <div className="col-span-12 overflow-hidden rounded-xl p-10 relative flex flex-col justify-end lg:col-span-8" style={heroBackground}>
          <div className="absolute inset-0 bg-black/35" />
          <div className="relative z-10 max-w-md">
            <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-tighter text-on-primary">Featured Collection</span>
            <h2 className="mt-4 font-display text-4xl font-black leading-tight text-white">{heroBookmark.title}</h2>
            <p className="mt-3 text-lg leading-relaxed text-white/85">{heroDescription}</p>
            <button
              type="button"
              className="mt-8 inline-flex items-center gap-2 font-bold text-white transition-all hover:gap-4"
              onClick={onOpenHero}
            >
              View Collection <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
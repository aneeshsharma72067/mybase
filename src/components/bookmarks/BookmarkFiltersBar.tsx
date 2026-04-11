import { Grid2x2, LayoutList } from 'lucide-react'

interface BookmarkFiltersBarProps {
  activeCategory: string
  categories: string[]
  onCategoryChange: (category: string) => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
}

export function BookmarkFiltersBar({
  activeCategory,
  categories,
  onCategoryChange,
  viewMode,
  onViewModeChange,
}: BookmarkFiltersBarProps) {
  return (
    <div className="mb-8 flex items-center justify-between gap-4 overflow-x-auto pb-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onCategoryChange('all')}
          className={[
            'rounded-full px-6 py-2 text-sm font-bold transition-all',
            activeCategory === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-variant',
          ].join(' ')}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            className={[
              'rounded-full px-6 py-2 text-sm font-bold transition-all',
              activeCategory === category
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-variant',
            ].join(' ')}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="relative flex items-center gap-1 rounded-full border border-outline-variant/20 bg-surface-container-lowest p-1 md:hidden">
        <span
          aria-hidden="true"
          className={[
            'absolute left-1 top-1 h-9 w-9 rounded-full bg-primary transition-transform duration-300 ease-out',
            viewMode === 'grid' ? 'translate-x-0' : 'translate-x-9',
          ].join(' ')}
        />
        <button
          type="button"
          onClick={() => onViewModeChange('grid')}
          className={[
            'relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300',
            viewMode === 'grid' ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface',
          ].join(' ')}
          aria-label="Grid view"
        >
          <Grid2x2 size={15} />
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange('list')}
          className={[
            'relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300',
            viewMode === 'list' ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface',
          ].join(' ')}
          aria-label="List view"
        >
          <LayoutList size={15} />
        </button>
      </div>
    </div>
  )
}
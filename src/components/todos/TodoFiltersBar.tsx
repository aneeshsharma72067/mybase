type TodoFilter = 'all' | 'pending' | 'completed' | 'today'

interface TodoFiltersBarProps {
  activeFilter: TodoFilter
  onFilterChange: (filter: TodoFilter) => void
  counts: Record<TodoFilter, number>
}

const filters: Array<{ id: TodoFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
  { id: 'today', label: 'Today' },
]

export function TodoFiltersBar({ activeFilter, onFilterChange, counts }: TodoFiltersBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => onFilterChange(filter.id)}
          className={[
            'rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors',
            activeFilter === filter.id
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container text-on-surface-variant hover:bg-primary-container hover:text-primary',
          ].join(' ')}
        >
          {filter.label} ({counts[filter.id]})
        </button>
      ))}
    </div>
  )
}

export type { TodoFilter }
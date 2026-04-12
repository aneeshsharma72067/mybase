import { useMemo } from 'react'
import { getAllTags, useThoughtsStore } from '../../store/useThoughtsStore'

export function ThoughtCloudCard() {
  const { thoughts, activeTagFilter, setTagFilter } = useThoughtsStore()
  const tags = useMemo(() => getAllTags(thoughts), [thoughts])

  return (
    <section className="space-y-4">
      <h4 className="px-1 font-display text-lg font-bold">Thought Cloud</h4>
      {tags.length === 0 ? (
        <p className="px-1 text-sm text-on-surface-variant">No tags yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setTagFilter(tag)}
              className={[
                'rounded-full px-4 py-2 text-xs font-semibold transition-colors',
                activeTagFilter === tag
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-highest text-on-surface hover:bg-primary-container hover:text-primary',
              ].join(' ')}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
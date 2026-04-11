interface ThoughtCloudCardProps {
  tags: string[]
  activeTag: string
  onTagChange: (tag: string) => void
}

export function ThoughtCloudCard({ tags, activeTag, onTagChange }: ThoughtCloudCardProps) {
  return (
    <section className="space-y-4">
      <h4 className="px-1 font-display text-lg font-bold">Thought Cloud</h4>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onTagChange(tag)}
            className={[
              'rounded-full px-4 py-2 text-xs font-semibold transition-colors',
              activeTag === tag
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-highest text-on-surface hover:bg-primary-container hover:text-primary',
            ].join(' ')}
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  )
}
import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ClarityChartCard } from '../components/thoughts/ClarityChartCard'
import { ConsistencyCard } from '../components/thoughts/ConsistencyCard'
import { ThoughtCalendarCard } from '../components/thoughts/ThoughtCalendarCard'
import { ThoughtCloudCard } from '../components/thoughts/ThoughtCloudCard'
import { ThoughtEditorModal } from '../components/thoughts/ThoughtEditorModal'
import { ThoughtHeroCard } from '../components/thoughts/ThoughtHeroCard'
import { ThoughtInsightCard } from '../components/thoughts/ThoughtInsightCard'
import { ThoughtsHeader } from '../components/thoughts/ThoughtsHeader'
import { ThoughtQuoteCard } from '../components/thoughts/ThoughtQuoteCard'
import {
  getAllTags,
  getDraftThoughts,
  getPinnedThoughts,
  getThoughtsByTag,
  useThoughtsStore,
} from '../store/useThoughtsStore'
import type { Thought } from '../types/thought.types'

const heroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCqUNBoFw54QJIu1Nm7L8S0bllyhsLW62h2PwXPccQMGFVwlR8zbW4m9ERR6NJgLgqcKHYDEf1T8R-0S5wtB5YspFWofvr2NutlQsuXFr0YzoK-KSvrWuV7YEaJWhtTctvt-xlmrT_4XQJB-UhxbqzdAfEqQMfINFB4eNvz3hGnqAisArAFBJyRA_8cVu-MUd8A3VXozAPe0h8j-MB-VFJrL8vY4Aez-yKZ0-zZ0OLP48blzZVq8aiUmU0Q525cZgAKziS-2w81Srs'

const NEW_THOUGHT_ID = '__new__'

function getThoughtTitle(thought: Thought): string {
  if (thought.type === 'quote') {
    return thought.attribution?.trim() || 'Quote'
  }

  return thought.title?.trim() || 'Untitled Thought'
}

function getThoughtBody(thought: Thought): string {
  if (thought.type === 'quote') {
    return thought.quoteText?.trim() || ''
  }

  return thought.body?.trim() || ''
}

export function ThoughtsPage() {
  const { thoughts, activeThoughtId, setActiveThought } = useThoughtsStore()
  const [searchValue, setSearchValue] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [mode, setMode] = useState<'month' | 'year'>('month')
  const [statusText, setStatusText] = useState('Ready to capture thoughts')

  const tags = useMemo(() => getAllTags(thoughts), [thoughts])
  const pinnedThoughts = useMemo(() => getPinnedThoughts(thoughts), [thoughts])
  const draftThoughts = useMemo(() => getDraftThoughts(thoughts), [thoughts])

  const heroThought = useMemo(() => pinnedThoughts[0] ?? thoughts[0] ?? null, [pinnedThoughts, thoughts])

  const activeThought = useMemo(
    () => thoughts.find((thought) => thought.id === activeThoughtId) ?? undefined,
    [activeThoughtId, thoughts],
  )

  const filteredFeedThoughts = useMemo(() => {
    let filtered = heroThought ? thoughts.filter((thought) => thought.id !== heroThought.id) : thoughts

    if (activeTag) {
      filtered = getThoughtsByTag(filtered, activeTag)
    }

    const query = searchValue.trim().toLowerCase()

    if (!query) {
      return filtered
    }

    return filtered.filter((thought) => {
      const haystack = [
        thought.title,
        thought.body,
        thought.quoteText,
        thought.attribution,
        thought.tags.join(' '),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [activeTag, heroThought, searchValue, thoughts])

  const summary = useMemo(() => {
    if (activeTag) {
      return `Filtering by ${activeTag}`
    }

    if (searchValue.trim()) {
      return `Search: ${searchValue}`
    }

    return 'All reflections'
  }, [activeTag, searchValue])

  const consistencyProgress = Math.min(100, thoughts.length * 18)

  const consistencySummary = useMemo(() => {
    if (thoughts.length === 0) {
      return 'Start your first reflection to begin your streak.'
    }

    if (draftThoughts.length > 0) {
      return `You have ${draftThoughts.length} draft ${draftThoughts.length === 1 ? 'thought' : 'thoughts'} waiting to be finished.`
    }

    return `You captured ${thoughts.length} thoughts recently. Keep the reflection rhythm going.`
  }, [draftThoughts.length, thoughts.length])

  return (
    <div className="mx-auto w-full max-w-400">
      <ThoughtsHeader
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onCreateThought={() => {
          setActiveThought(NEW_THOUGHT_ID)
          setStatusText('Composing a new thought')
        }}
        onOpenArchive={() => setStatusText('Archive opened')}
        onOpenSettings={() => setStatusText('Settings requested')}
        onOpenNotifications={() => setStatusText('Notifications checked')}
        statusText={statusText}
      />

      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <div className="col-span-12 space-y-6 lg:col-span-9 lg:space-y-8">
          {thoughts.length === 0 ? (
            <div className="rounded-xl bg-surface-container-lowest p-12 text-center">
              <p className="text-on-surface-variant">No thoughts yet. Add your first one.</p>
              <button
                type="button"
                onClick={() => setActiveThought(NEW_THOUGHT_ID)}
                className="mt-4 rounded-full bg-primary px-6 py-2 text-sm font-bold text-on-primary hover:bg-primary-dim"
              >
                New Thought
              </button>
            </div>
          ) : (
            <>
              {heroThought ? (
                <ThoughtHeroCard
                  title={getThoughtTitle(heroThought)}
                  body={getThoughtBody(heroThought)}
                  date={format(new Date(heroThought.createdAt), 'MMMM d, yyyy')}
                  backgroundImage={heroImage}
                  onContinue={() => {
                    setActiveThought(heroThought.id)
                    setStatusText('Continue writing opened')
                  }}
                  onShare={() => setStatusText('Share panel opened')}
                />
              ) : null}

              {filteredFeedThoughts.length === 0 ? (
                <div className="rounded-xl bg-surface-container-lowest p-10 text-center text-on-surface-variant">
                  No thoughts match this filter.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  {filteredFeedThoughts.map((thought) =>
                    thought.type === 'quote' ? (
                      <ThoughtQuoteCard
                        key={thought.id}
                        quote={thought.quoteText?.trim() || 'No quote text yet.'}
                        authorLabel={thought.attribution?.trim() || 'Unknown'}
                        note={summary}
                        dateLabel={format(new Date(thought.createdAt), 'MMM d')}
                        tags={thought.tags}
                      />
                    ) : (
                      <ThoughtInsightCard
                        key={thought.id}
                        title={thought.title?.trim() || 'Untitled Thought'}
                        body={thought.body?.trim() || 'This draft is waiting for your next line.'}
                        dateLabel={format(new Date(thought.createdAt), 'MMM d')}
                        tags={thought.tags}
                      />
                    ),
                  )}
                </div>
              )}
            </>
          )}

          <ClarityChartCard mode={mode} onModeChange={setMode} />
        </div>

        <aside className="col-span-12 space-y-6 lg:col-span-3 lg:space-y-8">
          <ThoughtCalendarCard
            initialDate={new Date()}
            onDateSelect={(date) => setStatusText(`Selected ${format(date, 'MMM d, yyyy')}`)}
          />
          <ThoughtCloudCard
            tags={tags}
            activeTag={activeTag}
            onTagChange={(tag) => setActiveTag((current) => (current === tag ? null : tag))}
          />
          <ConsistencyCard
            progress={consistencyProgress}
            summary={consistencySummary}
          />
        </aside>
      </div>

      <ThoughtEditorModal
        isOpen={activeThoughtId !== null}
        thought={activeThoughtId === NEW_THOUGHT_ID ? undefined : activeThought}
        onClose={() => setActiveThought(null)}
      />
    </div>
  )
}

export default ThoughtsPage
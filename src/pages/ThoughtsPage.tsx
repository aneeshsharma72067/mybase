import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { ClarityChartCard } from '../components/thoughts/ClarityChartCard'
import { ConsistencyCard } from '../components/thoughts/ConsistencyCard'
import { ThoughtCalendarCard } from '../components/thoughts/ThoughtCalendarCard'
import { ThoughtCloudCard } from '../components/thoughts/ThoughtCloudCard'
import { ThoughtEditorModal } from '../components/thoughts/ThoughtEditorModal'
import { ThoughtHeroCard } from '../components/thoughts/ThoughtHeroCard'
import { ThoughtInsightCard } from '../components/thoughts/ThoughtInsightCard'
import { ThoughtsHeader } from '../components/thoughts/ThoughtsHeader'
import { ThoughtQuoteCard } from '../components/thoughts/ThoughtQuoteCard'
import { getFilteredThoughts, useThoughtsStore } from '../store/useThoughtsStore'
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
  const navigate = useNavigate()
  const {
    thoughts,
    activeThoughtId,
    activeTagFilter,
    activeDateFilter,
    setActiveThought,
    setTagFilter,
    setDateFilter,
  } = useThoughtsStore()
  const [searchValue, setSearchValue] = useState('')
  const [statusText, setStatusText] = useState('Ready to capture thoughts')

  const filteredThoughts = useMemo(
    () => getFilteredThoughts(thoughts, activeTagFilter, activeDateFilter),
    [activeDateFilter, activeTagFilter, thoughts],
  )

  const displayedThoughts = useMemo(() => {
    const query = searchValue.trim().toLowerCase()

    if (!query) {
      return filteredThoughts
    }

    return filteredThoughts.filter((thought) => {
      const haystack = [thought.title, thought.body, thought.quoteText, thought.attribution, thought.tags.join(' ')]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [filteredThoughts, searchValue])

  const heroThought = useMemo(() => displayedThoughts[0] ?? null, [displayedThoughts])

  const activeThought = useMemo(
    () => thoughts.find((thought) => thought.id === activeThoughtId) ?? undefined,
    [activeThoughtId, thoughts],
  )

  const filterSummary = useMemo(() => {
    const parts: string[] = []

    if (activeTagFilter) {
      parts.push(`#${activeTagFilter}`)
    }

    if (activeDateFilter) {
      parts.push(format(new Date(activeDateFilter), 'MMM d, yyyy'))
    }

    if (parts.length === 0) {
      return 'All reflections'
    }

    return `Filtered by: ${parts.join(' · ')}`
  }, [activeDateFilter, activeTagFilter])

  const visibleFeedThoughts = heroThought ? displayedThoughts.slice(1) : displayedThoughts

  const emptyStateMessage = useMemo(() => {
    if (activeDateFilter) {
      return `No thoughts recorded on ${format(new Date(activeDateFilter), 'MMM d, yyyy')}.`
    }

    if (activeTagFilter) {
      return `No thoughts match #${activeTagFilter}.`
    }

    if (searchValue.trim()) {
      return 'No matching thoughts yet.'
    }

    return 'No thoughts yet. Add your first one.'
  }, [activeDateFilter, activeTagFilter, searchValue])

  function clearFilters() {
    setTagFilter(null)
    setDateFilter(null)
  }

  return (
    <div className="mx-auto w-full max-w-400">
      <ThoughtsHeader
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onCreateThought={() => {
          setActiveThought(NEW_THOUGHT_ID)
          setStatusText('Composing a new thought')
        }}
        onOpenSettings={() => navigate('/settings')}
        statusText={statusText}
      />

      {(activeTagFilter || activeDateFilter) && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-full border border-outline-variant/60 bg-surface-container-lowest px-4 py-2 text-xs text-on-surface-variant">
          <span>{filterSummary}</span>
          <button type="button" onClick={clearFilters} className="font-semibold text-primary hover:underline">
            Clear filters
          </button>
        </div>
      )}

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

              {displayedThoughts.length === 0 ? (
                <div className="rounded-xl bg-surface-container-lowest p-10 text-center text-on-surface-variant">
                  {emptyStateMessage}
                </div>
              ) : visibleFeedThoughts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  {visibleFeedThoughts.map((thought) =>
                    thought.type === 'quote' ? (
                      <ThoughtQuoteCard
                        key={thought.id}
                        quote={thought.quoteText?.trim() || 'No quote text yet.'}
                        authorLabel={thought.attribution?.trim() || 'Unknown'}
                        note={filterSummary}
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
              ) : null}
            </>
          )}

          <ClarityChartCard />
        </div>

        <aside className="col-span-12 space-y-6 lg:col-span-3 lg:space-y-8">
          <ThoughtCalendarCard onDateSelect={(date) => setStatusText(`Selected ${format(date, 'MMM d, yyyy')}`)} />
          <ThoughtCloudCard />
          <ConsistencyCard />
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
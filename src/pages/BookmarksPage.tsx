import { useEffect, useMemo, useRef, useState } from 'react'
import { BookmarkCard } from '../components/bookmarks/BookmarkCard'
import { BookmarkComposer } from '../components/bookmarks/BookmarkComposer'
import { BookmarkFiltersBar } from '../components/bookmarks/BookmarkFiltersBar'
import { BookmarksHeader } from '../components/bookmarks/BookmarksHeader'
import { BookmarksHero } from '../components/bookmarks/BookmarksHero'
import { useBookmarksStore } from '../store/useBookmarksStore'
import type { Bookmark } from '../types/bookmark.types'

const seedBookmarks: Array<Omit<Bookmark, 'id' | 'createdAt'>> = [
  {
    title: 'Forest Bathing Guide',
    url: 'https://example.com/forest-bathing',
    category: 'Reference',
    notes: 'A calm reading anchor for biophilic design and restorative layouts.',
    coverImageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDpmcnCpTzsA7jU1g_QTv1Z8ChfKkwxnnhUOEJrX3t-lkJ_D9U933jPFoODhEgu15q8cYR8WbwhpOE7-WY915hkIzulhoPPeW_cLWp-VfNwkW3J5MOiomivZYkzD_8DnqNEV2Cw5aNI36As_nbLkNUjE27T7Ub6-uVnaUl91ymstyR4jzcH4sN4QT-ZzXpIA3WKDllnvUDnB7JZ_tCMmZtINVQcs9FL4OrhEidfOkeFb93-JDheDCdHk8_shkqM3jO5gA39hs4zDlM',
  },
  {
    title: 'Tailwind CSS v4 Roadmap',
    url: 'https://example.com/tailwind-v4-roadmap',
    category: 'Tech',
    notes: 'Exploring the next oxide-powered release and its utility-first patterns.',
  },
  {
    title: 'Architecture Digest 2024',
    url: 'https://example.com/architecture-digest-2024',
    category: 'Design',
    notes: 'Saved for interiors with strong grids, light, and material rhythm.',
    coverImageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD6CI_oocelmK04D04vdKlB-04lYp0vncKCxkBaj1caOeXOZqkmtG5gS4ser0UsIV0dKA-K8qD634n_ArVstM_kDcCsyLbVi20jGJ7--2ahFgT5tl8XLdh3ERToM-kZNN45EGrYYhtX5vnUUvXLOJsEkMF4_9rD-MFa5W-ad1XO8Xn5Y3pQqxaNTV0y9mN4AMnTWQcK_4jzilfFnot7g2RAnSiu4P_A9tVpE8xdzB83DxI757n9DNZUExCzuaboShNUFgMljBNmyhI',
  },
  {
    title: 'The Future of AI UX',
    url: 'https://example.com/future-ai-ux',
    category: 'Research',
    notes: 'Interface agents will reshape how people coordinate work and intent.',
    favicon:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB0EpbR95R2i534Bxs78Wkbwl8BH_ZyN6mSxAw9UzYZQgWjEmu4CzxCowItcx9sCTQ-GXuCOJT0aRhfpwloS1py6sO5tIUF_C-0MulL48-ZV-jGtVkdQwlEWLl-CWYajSBoAB2_78qmrjAgODBqnqBi8NP6vrIurq6gknok6ZUvO9o0WpJeB9WuhcZweKmxGk3QJT4GcbPnd7RpucUV2uUxmQrwGrUYylwQaXKwlali6qJ_LBjrrehcJ2brXNuM3lcRW1D2wIK1j8A',
  },
  {
    title: 'Biophilic Patterns in UI',
    url: 'https://example.com/biophilic-patterns-ui',
    category: 'Design',
    notes: 'Essential reading for organic design systems and calmer surfaces.',
    coverImageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAmDRtTboP43dJiSPPg3IUIfPc3rM-_wwDtMqRBRLRAmAIhVSu3WOYS-KBGmvpjUMZDJAGLlY09Xa7aBon0Ll6mEcYJZH--XtxtKipELLw8aITBvFNN8ZHjt0aa1gbVfxqWSqFRPPW0VITnARBxJ-vYDcWjzEZqRj6AcoZ_68bQEeqkal6053Mf9HvkeFdG2DlNJPZ7W2G-ks4jKbKEgCJ_0phE9-oXOQgdmScpEJwqkDNXc_sR1pGGT07mE5ZT1ofapPTGhL4BBJs',
  },
  {
    title: 'Portfolio Ideas',
    url: 'https://example.com/portfolio-ideas',
    category: 'Reference',
    notes: 'A collection of interactions and micro-animations for the next redesign.',
  },
]

type ViewMode = 'grid' | 'list'

export function BookmarksPage() {
  const bookmarks = useBookmarksStore((state) => state.bookmarks)
  const categories = useBookmarksStore((state) => state.categories)
  const addBookmark = useBookmarksStore((state) => state.addBookmark)
  const updateBookmark = useBookmarksStore((state) => state.updateBookmark)
  const deleteBookmark = useBookmarksStore((state) => state.deleteBookmark)

  const [searchValue, setSearchValue] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
  const [visibleCount, setVisibleCount] = useState(9)
  const [statusText, setStatusText] = useState('Bookmarks ready')
  const hasSeededRef = useRef(false)

  useEffect(() => {
    if (hasSeededRef.current || bookmarks.length > 0 || categories.length > 0) {
      return
    }

    hasSeededRef.current = true
    seedBookmarks.forEach((bookmark) => addBookmark(bookmark))
  }, [addBookmark, bookmarks.length, categories.length])

  const normalizedCategories = useMemo(() => {
    const preferredOrder = ['Design', 'Tech', 'Research', 'Reference']
    const ordered = preferredOrder.filter((category) => categories.includes(category))
    const extras = categories.filter((category) => !preferredOrder.includes(category))
    return ordered.concat(extras.length > 0 ? extras : preferredOrder.filter((category) => !ordered.includes(category)))
  }, [categories])

  const filteredBookmarks = useMemo(() => {
    const loweredSearch = searchValue.trim().toLowerCase()

    return bookmarks.filter((bookmark) => {
      const categoryMatch = activeCategory === 'all' || bookmark.category === activeCategory
      const searchMatch =
        !loweredSearch ||
        bookmark.title.toLowerCase().includes(loweredSearch) ||
        bookmark.url.toLowerCase().includes(loweredSearch) ||
        (bookmark.notes ?? '').toLowerCase().includes(loweredSearch)

      return categoryMatch && searchMatch
    })
  }, [activeCategory, bookmarks, searchValue])

  const visibleBookmarks = filteredBookmarks.slice(0, visibleCount)

  const categoryBreakdown = useMemo(() => {
    const order = ['Design', 'Tech', 'Research', 'Reference']

    return order.map((category) => ({
      name: category,
      count: bookmarks.filter((bookmark) => bookmark.category === category).length,
      color: category === 'Design' ? '#2d6a4f' : category === 'Tech' ? '#b1f0ce' : category === 'Research' ? '#dfe4de' : '#ebefe9',
    }))
  }, [bookmarks])

  useEffect(() => {
    setVisibleCount(9)
  }, [activeCategory, searchValue, viewMode])

  function handleCreateBookmark(input: Omit<Bookmark, 'id' | 'createdAt'>) {
    if (editingBookmark) {
      updateBookmark(editingBookmark.id, input)
      setStatusText('Bookmark updated')
      return
    }

    addBookmark(input)
    setStatusText('Bookmark added')
  }

  function openCreateComposer() {
    setEditingBookmark(null)
    setIsComposerOpen(true)
  }

  function openEditComposer(bookmark: Bookmark) {
    setEditingBookmark(bookmark)
    setIsComposerOpen(true)
  }

  function handleOpenBookmark(bookmark: Bookmark) {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="mx-auto w-full max-w-400">
      <BookmarksHeader
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCreateBookmark={openCreateComposer}
        onOpenSettings={() => setStatusText('Settings opened')}
        onOpenArchive={() => setStatusText('Archive viewed')}
      />

      <BookmarksHero totalCount={bookmarks.length} categoryBreakdown={categoryBreakdown} />

      <BookmarkFiltersBar
        activeCategory={activeCategory}
        categories={normalizedCategories}
        onCategoryChange={(category) => {
          setActiveCategory(category)
          setStatusText(category === 'all' ? 'Showing all bookmarks' : `Filtered by ${category}`)
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div
        key={viewMode}
        className={[
          'bookmarks-layout-enter',
          viewMode === 'grid' ? 'columns-1 gap-8 space-y-8 md:columns-2 lg:columns-3' : 'space-y-4',
        ].join(' ')}
      >
        {visibleBookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            mode={viewMode}
            onOpen={handleOpenBookmark}
            onEdit={openEditComposer}
            onDelete={(item) => {
              deleteBookmark(item.id)
              setStatusText('Bookmark deleted')
            }}
          />
        ))}
      </div>

      {visibleBookmarks.length === 0 ? (
        <div className="rounded-xl bg-surface-container-low p-8 text-center text-on-surface-variant">
          No bookmarks match this filter.
        </div>
      ) : null}

      <div className="mt-16 flex justify-center">
        <button
          type="button"
          onClick={() => setVisibleCount((count) => count + 6)}
          className="flex items-center gap-3 rounded-full bg-surface-container-highest px-10 py-4 font-bold text-on-surface transition-all hover:bg-surface-dim"
        >
          Load More <span aria-hidden="true">⌄</span>
        </button>
      </div>

      <button
        type="button"
        onClick={openCreateComposer}
        className="fixed bottom-10 right-10 z-30 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-primary shadow-2xl transition-transform active:scale-90"
        aria-label="Add bookmark"
      >
        <span className="text-3xl leading-none">+</span>
      </button>

      <div className="mt-6 rounded-full bg-surface-container-low px-4 py-2 text-center text-xs font-semibold text-on-surface-variant">
        {statusText}
      </div>

      <BookmarkComposer
        isOpen={isComposerOpen}
        editingBookmark={editingBookmark}
        onClose={() => {
          setIsComposerOpen(false)
          setEditingBookmark(null)
        }}
        onSave={handleCreateBookmark}
      />
    </div>
  )
}

export default BookmarksPage
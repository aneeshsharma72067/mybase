import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookmarkCard } from '../components/bookmarks/BookmarkCard'
import { AddBookmarkModal } from '../components/bookmarks/AddBookmarkModal'
import { BookmarkFiltersBar } from '../components/bookmarks/BookmarkFiltersBar'
import { BookmarksHeader } from '../components/bookmarks/BookmarksHeader'
import { BookmarksHero } from '../components/bookmarks/BookmarksHero'
import {
  getAllCategories,
  getCategoryDistribution,
  getFilteredBookmarks,
  getPinnedBookmark,
  useBookmarksStore,
} from '../store/useBookmarksStore'
import type { Bookmark } from '../types/bookmark.types'
import { ChevronDown } from 'lucide-react'

type ViewMode = 'grid' | 'list'

export function BookmarksPage() {
  const navigate = useNavigate()
  const bookmarks = useBookmarksStore((state) => state.bookmarks)
  const activeCategoryFilter = useBookmarksStore((state) => state.activeCategoryFilter)
  const searchQuery = useBookmarksStore((state) => state.searchQuery)
  const visibleCount = useBookmarksStore((state) => state.visibleCount)
  const addBookmark = useBookmarksStore((state) => state.addBookmark)
  const updateBookmark = useBookmarksStore((state) => state.updateBookmark)
  const deleteBookmark = useBookmarksStore((state) => state.deleteBookmark)
  const pinBookmark = useBookmarksStore((state) => state.pinBookmark)
  const setCategoryFilter = useBookmarksStore((state) => state.setCategoryFilter)
  const setSearchQuery = useBookmarksStore((state) => state.setSearchQuery)
  const loadMore = useBookmarksStore((state) => state.loadMore)
  const resetPagination = useBookmarksStore((state) => state.resetPagination)

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showAddBookmark, setShowAddBookmark] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
  const [statusText, setStatusText] = useState('Bookmarks ready')
  const hasResetRef = useRef(false)

  const categories = useMemo(() => getAllCategories(bookmarks), [bookmarks])

  const pinned = useMemo(() => getPinnedBookmark(bookmarks), [bookmarks])
  const heroBookmark = pinned ?? bookmarks[0]

  const filteredBookmarks = useMemo(
    () => getFilteredBookmarks(bookmarks, activeCategoryFilter, searchQuery),
    [activeCategoryFilter, bookmarks, searchQuery],
  )

  const visibleBookmarks = filteredBookmarks.slice(0, visibleCount)

  const distribution = useMemo(() => getCategoryDistribution(bookmarks), [bookmarks])

  useEffect(() => {
    if (!hasResetRef.current) {
      hasResetRef.current = true
      return
    }

    resetPagination()
  }, [activeCategoryFilter, resetPagination, searchQuery])

  function handleSaveBookmark(input: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) {
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
    setShowAddBookmark(true)
  }

  function openEditComposer(bookmark: Bookmark) {
    setEditingBookmark(bookmark)
    setShowAddBookmark(true)
  }

  function handleOpenHero() {
    if (!heroBookmark) {
      return
    }

    window.open(heroBookmark.url, '_blank', 'noopener noreferrer')
  }

  return (
    <div className="mx-auto w-full max-w-400">
      <BookmarksHeader
        searchValue={searchQuery}
        onSearchValueChange={(value) => {
          setSearchQuery(value)
          resetPagination()
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCreateBookmark={openCreateComposer}
        onOpenSettings={() => navigate('/settings')}
      />

      <BookmarksHero
        heroBookmark={heroBookmark}
        distribution={distribution}
        totalCount={bookmarks.length}
        onOpenHero={() => handleOpenHero()}
      />

      <BookmarkFiltersBar
        activeCategory={activeCategoryFilter}
        categories={categories}
        onCategoryChange={(category) => {
          setCategoryFilter(category)
          setStatusText(category === null ? 'Showing all bookmarks' : `Filtered by ${category}`)
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
            onEdit={openEditComposer}
            onDelete={(item) => {
              deleteBookmark(item.id)
              setStatusText('Bookmark deleted')
            }}
            onPin={(item) => {
              pinBookmark(item.id)
              setStatusText(item.isPinned ? 'Bookmark unpinned' : 'Bookmark pinned')
            }}
          />
        ))}
      </div>

      {visibleBookmarks.length === 0 ? (
        <div className="rounded-xl bg-surface-container-low p-8 text-center text-on-surface-variant">
          {searchQuery.trim()
            ? `No bookmarks match '${searchQuery}'`
            : activeCategoryFilter
            ? `No bookmarks in '${activeCategoryFilter}' yet.`
            : 'No bookmarks yet. Add your first one.'}
        </div>
      ) : null}

      {filteredBookmarks.length > visibleCount ? (
        <div className="mt-16 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            className="flex items-center gap-1 rounded-full bg-surface-container-highest px-10 py-4 font-bold text-on-surface transition-all hover:bg-surface-dim"
          >
            Load More <ChevronDown />
          </button>
        </div>
      ) : null}

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

      <AddBookmarkModal
        isOpen={showAddBookmark}
        categories={categories}
        editingBookmark={editingBookmark}
        onClose={() => {
          setShowAddBookmark(false)
          setEditingBookmark(null)
        }}
        onCreate={handleSaveBookmark}
        onUpdate={updateBookmark}
      />
    </div>
  )
}

export default BookmarksPage
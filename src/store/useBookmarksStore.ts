import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { createZustandStorage } from '../lib/storage'
import type { Bookmark } from '../types/bookmark.types'

type BookmarksStoreActions = {
  addBookmark: (payload: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBookmark: (id: string, patch: Partial<Bookmark>) => void
  deleteBookmark: (id: string) => void
  pinBookmark: (id: string) => void
  setCategoryFilter: (category: string | null) => void
  setSearchQuery: (query: string) => void
  loadMore: () => void
  resetPagination: () => void
}

export interface BookmarkStoreState {
  bookmarks: Bookmark[]
  activeCategoryFilter: string | null
  searchQuery: string
  visibleCount: number
}

export type BookmarksStore = BookmarkStoreState & BookmarksStoreActions

const initialState: BookmarkStoreState = {
  bookmarks: [],
  activeCategoryFilter: null,
  searchQuery: '',
  visibleCount: 9,
}

type LegacyBookmark = Partial<Bookmark> & {
  coverImageUrl?: string
}

function normalizeBookmark(input: LegacyBookmark): Bookmark {
  const now = new Date().toISOString()

  return {
    id: input.id ?? uuidv4(),
    url: input.url ?? '',
    title: input.title ?? 'Untitled',
    description: input.description,
    coverImage: input.coverImage ?? input.coverImageUrl,
    favicon: input.favicon,
    category: input.category ?? 'reference',
    tags: Array.isArray(input.tags) ? input.tags : [],
    notes: input.notes,
    isPinned: Boolean(input.isPinned),
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? input.createdAt ?? now,
  }
}

export const useBookmarksStore = create<BookmarksStore>()(
  persist(
    immer((set) => ({
      ...initialState,
      addBookmark: (payload) => {
        set((state) => {
          if (payload.isPinned) {
            state.bookmarks.forEach((item) => {
              item.isPinned = false
            })
          }

          const now = new Date().toISOString()

          state.bookmarks.push({
            ...payload,
            id: uuidv4(),
            createdAt: now,
            updatedAt: now,
          })
        })
      },
      updateBookmark: (id, patch) => {
        set((state) => {
          const bookmark = state.bookmarks.find((item) => item.id === id)

          if (bookmark) {
            if (patch.isPinned) {
              state.bookmarks.forEach((item) => {
                item.isPinned = item.id === id
              })
            }

            Object.assign(bookmark, patch)
            bookmark.updatedAt = new Date().toISOString()
          }
        })
      },
      deleteBookmark: (id) => {
        set((state) => {
          state.bookmarks = state.bookmarks.filter((bookmark) => bookmark.id !== id)
        })
      },
      pinBookmark: (id) => {
        set((state) => {
          const bookmark = state.bookmarks.find((item) => item.id === id)

          if (!bookmark) {
            return
          }

          const shouldPin = !bookmark.isPinned
          state.bookmarks.forEach((item) => {
            item.isPinned = shouldPin ? item.id === id : false
          })
        })
      },
      setCategoryFilter: (category) => {
        set((state) => {
          state.activeCategoryFilter = category
        })
      },
      setSearchQuery: (query) => {
        set((state) => {
          state.searchQuery = query
        })
      },
      loadMore: () => {
        set((state) => {
          state.visibleCount += 9
        })
      },
      resetPagination: () => {
        set((state) => {
          state.visibleCount = 9
        })
      },
    })),
    {
      name: 'mybase-bookmarks',
      version: 1,
      storage: createZustandStorage(),
      migrate: (persistedState) => {
        const state = (persistedState ?? {}) as Partial<BookmarkStoreState> & {
          bookmarks?: LegacyBookmark[]
        }

        const normalizedBookmarks = (state.bookmarks ?? []).map(normalizeBookmark)

        return {
          bookmarks: normalizedBookmarks,
          activeCategoryFilter: state.activeCategoryFilter ?? null,
          searchQuery: state.searchQuery ?? '',
          visibleCount: state.visibleCount ?? 9,
        }
      },
      partialize: (state) => ({
        bookmarks: state.bookmarks,
        activeCategoryFilter: state.activeCategoryFilter,
        searchQuery: state.searchQuery,
        visibleCount: state.visibleCount,
      }),
    },
  ),
)

export function getPinnedBookmark(bookmarks: Bookmark[]): Bookmark | undefined {
  return bookmarks.find((bookmark) => bookmark.isPinned)
}

export function getFilteredBookmarks(
  bookmarks: Bookmark[],
  category: string | null,
  search: string,
): Bookmark[] {
  const loweredSearch = search.trim().toLowerCase()

  return bookmarks
    .filter((bookmark) => !bookmark.isPinned)
    .filter((bookmark) => (category ? bookmark.category === category : true))
    .filter((bookmark) => {
      if (!loweredSearch) {
        return true
      }

      return (
        bookmark.title.toLowerCase().includes(loweredSearch) ||
        (bookmark.description ?? '').toLowerCase().includes(loweredSearch) ||
        bookmark.url.toLowerCase().includes(loweredSearch)
      )
    })
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
}

export function getAllCategories(bookmarks: Bookmark[]): string[] {
  return Array.from(new Set(bookmarks.map((bookmark) => bookmark.category))).sort((a, b) => a.localeCompare(b))
}

export function getCategoryDistribution(
  bookmarks: Bookmark[],
): Array<{ category: string; count: number; percentage: number }> {
  const total = bookmarks.length

  if (total === 0) {
    return []
  }

  const counts = bookmarks.reduce<Map<string, number>>((map, bookmark) => {
    const key = bookmark.category
    map.set(key, (map.get(key) ?? 0) + 1)
    return map
  }, new Map())

  return Array.from(counts.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((left, right) => right.count - left.count)
}

export function getFaviconUrl(bookmark: Bookmark): string {
  if (bookmark.favicon && bookmark.favicon.trim().length > 0) {
    return bookmark.favicon
  }

  try {
    const hostname = new URL(bookmark.url).hostname
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
  } catch {
    return ''
  }
}

export function getGradientForCategory(category: string): string {
  const normalized = (category ?? '').trim().toLowerCase()

  if (normalized === 'design') {
    return 'linear-gradient(135deg, #2d5a3d, #4a9e6b)'
  }

  if (normalized === 'tech') {
    return 'linear-gradient(135deg, #1a3a5c, #2d6a9f)'
  }

  if (normalized === 'research') {
    return 'linear-gradient(135deg, #4a3728, #8b6347)'
  }

  if (normalized === 'reference') {
    return 'linear-gradient(135deg, #3d3d2d, #7a7a3a)'
  }

  if (normalized === 'personal') {
    return 'linear-gradient(135deg, #4a2d5c, #8b4fa0)'
  }

  return 'linear-gradient(135deg, #2d4a3d, #3d7a5c)'
}
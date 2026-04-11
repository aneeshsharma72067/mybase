import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { createZustandStorage } from '../lib/storage'
import { generateId } from '../lib/utils'
import type { Bookmark, BookmarkStoreState } from '../types/bookmark.types'

type BookmarksStoreActions = {
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void
  updateBookmark: (id: string, patch: Partial<Bookmark>) => void
  deleteBookmark: (id: string) => void
  addCategory: (name: string) => void
}

export type BookmarksStore = BookmarkStoreState & BookmarksStoreActions

const initialState: BookmarkStoreState = {
  bookmarks: [],
  categories: [],
}

export const useBookmarksStore = create<BookmarksStore>()(
  persist(
    immer((set) => ({
      ...initialState,
      addBookmark: (bookmark) => {
        set((state) => {
          state.bookmarks.push({
            ...bookmark,
            id: generateId(),
            createdAt: new Date().toISOString(),
          })

          if (!state.categories.includes(bookmark.category)) {
            state.categories.push(bookmark.category)
          }
        })
      },
      updateBookmark: (id, patch) => {
        set((state) => {
          const bookmark = state.bookmarks.find((item) => item.id === id)

          if (bookmark) {
            Object.assign(bookmark, patch)
          }
        })
      },
      deleteBookmark: (id) => {
        set((state) => {
          state.bookmarks = state.bookmarks.filter((bookmark) => bookmark.id !== id)
        })
      },
      addCategory: (name) => {
        set((state) => {
          if (!state.categories.includes(name)) {
            state.categories.push(name)
          }
        })
      },
    })),
    {
      name: 'mybase-bookmarks',
      storage: createZustandStorage(),
      partialize: (state) => ({
        bookmarks: state.bookmarks,
        categories: state.categories,
      }),
    },
  ),
)

export function getByCategory(category: string): Bookmark[] {
  return useBookmarksStore
    .getState()
    .bookmarks.filter((bookmark) => bookmark.category === category)
}
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { createZustandStorage } from '../lib/storage'
import type { Thought, ThoughtStoreState } from '../types/thought.types'

type ThoughtsStoreActions = {
  addThought: (payload: Omit<Thought, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateThought: (id: string, patch: Partial<Thought>) => void
  deleteThought: (id: string) => void
  togglePin: (id: string) => void
  setActiveThought: (id: string | null) => void
  setTagFilter: (tag: string | null) => void
  setDateFilter: (date: string | null) => void
}

export type ThoughtsStore = ThoughtStoreState & ThoughtsStoreActions

function normalizeTitleForAdd(payload: Omit<Thought, 'id' | 'createdAt' | 'updatedAt'>): string | undefined {
  if (payload.type !== 'braindump') {
    return payload.title
  }

  const normalized = payload.title?.trim() ?? ''

  if (normalized.length > 0) {
    return normalized
  }

  return `Brain Dump on ${format(new Date(), 'MMM d, yyyy')}`
}

const initialState: ThoughtStoreState = {
  thoughts: [],
  activeThoughtId: null,
  activeTagFilter: null,
  activeDateFilter: null,
}

export const useThoughtsStore = create<ThoughtsStore>()(
  persist(
    immer((set) => ({
      ...initialState,
      addThought: (payload) => {
        set((state) => {
          const now = new Date().toISOString()

          state.thoughts.push({
            ...payload,
            title: normalizeTitleForAdd(payload),
            id: uuidv4(),
            createdAt: now,
            updatedAt: now,
          })
        })
      },
      updateThought: (id, patch) => {
        set((state) => {
          const thought = state.thoughts.find((item) => item.id === id)

          if (thought) {
            Object.assign(thought, patch)
            thought.updatedAt = new Date().toISOString()
          }
        })
      },
      deleteThought: (id) => {
        set((state) => {
          state.thoughts = state.thoughts.filter((thought) => thought.id !== id)

          if (state.activeThoughtId === id) {
            state.activeThoughtId = null
          }
        })
      },
      togglePin: (id) => {
        set((state) => {
          const thought = state.thoughts.find((item) => item.id === id)

          if (thought) {
            thought.isPinned = !thought.isPinned
            thought.updatedAt = new Date().toISOString()
          }
        })
      },
      setActiveThought: (id) => {
        set((state) => {
          state.activeThoughtId = id
        })
      },
      setTagFilter: (tag) => {
        set((state) => {
          state.activeTagFilter = state.activeTagFilter === tag ? null : tag
        })
      },
      setDateFilter: (date) => {
        set((state) => {
          state.activeDateFilter = date
        })
      },
    })),
    {
      name: 'mybase-thoughts',
      storage: createZustandStorage(),
      partialize: (state) => ({
        thoughts: state.thoughts,
        activeThoughtId: state.activeThoughtId,
        activeTagFilter: state.activeTagFilter,
        activeDateFilter: state.activeDateFilter,
      }),
    },
  ),
)

export function getPinnedThoughts(thoughts: Thought[]): Thought[] {
  return thoughts.filter((thought) => thought.isPinned)
}

export function getThoughtsByTag(thoughts: Thought[], tag: string): Thought[] {
  return thoughts.filter((thought) => thought.tags.includes(tag))
}

export function getAllTags(thoughts: Thought[]): string[] {
  return Array.from(new Set(thoughts.flatMap((thought) => thought.tags))).sort((a, b) => a.localeCompare(b))
}

export function getDraftThoughts(thoughts: Thought[]): Thought[] {
  return thoughts.filter((thought) => thought.type === 'braindump' && thought.isDraft)
}

export function getFilteredThoughts(thoughts: Thought[], tagFilter: string | null, dateFilter: string | null): Thought[] {
  const filtered = thoughts.filter((thought) => {
    const tagMatch = !tagFilter || thought.tags.includes(tagFilter)
    const dateMatch = !dateFilter || thought.createdAt.startsWith(dateFilter)

    return tagMatch && dateMatch
  })

  return [...filtered].sort((left, right) => {
    if (left.isPinned !== right.isPinned) {
      return left.isPinned ? -1 : 1
    }

    return right.createdAt.localeCompare(left.createdAt)
  })
}
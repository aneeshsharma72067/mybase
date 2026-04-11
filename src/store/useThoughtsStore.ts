import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { createZustandStorage } from '../lib/storage'
import { generateId } from '../lib/utils'
import type { Thought, ThoughtStoreState, ThoughtTag } from '../types/thought.types'

type ThoughtsStoreActions = {
  addThought: (body: string, tags: ThoughtTag[]) => void
  updateThought: (id: string, patch: Partial<Thought>) => void
  deleteThought: (id: string) => void
  togglePin: (id: string) => void
}

export type ThoughtsStore = ThoughtStoreState & ThoughtsStoreActions

const initialState: ThoughtStoreState = {
  thoughts: [],
}

export const useThoughtsStore = create<ThoughtsStore>()(
  persist(
    immer((set) => ({
      ...initialState,
      addThought: (body, tags) => {
        set((state) => {
          state.thoughts.push({
            id: generateId(),
            body,
            tags,
            createdAt: new Date().toISOString(),
            pinned: false,
          })
        })
      },
      updateThought: (id, patch) => {
        set((state) => {
          const thought = state.thoughts.find((item) => item.id === id)

          if (thought) {
            Object.assign(thought, patch)
          }
        })
      },
      deleteThought: (id) => {
        set((state) => {
          state.thoughts = state.thoughts.filter((thought) => thought.id !== id)
        })
      },
      togglePin: (id) => {
        set((state) => {
          const thought = state.thoughts.find((item) => item.id === id)

          if (thought) {
            thought.pinned = !thought.pinned
          }
        })
      },
    })),
    {
      name: 'mybase-thoughts',
      storage: createZustandStorage(),
      partialize: (state) => ({ thoughts: state.thoughts }),
    },
  ),
)

export function getByTag(tag: ThoughtTag): Thought[] {
  return useThoughtsStore
    .getState()
    .thoughts.filter((thought) => thought.tags.includes(tag))
}

export function getPinned(): Thought[] {
  return useThoughtsStore.getState().thoughts.filter((thought) => thought.pinned)
}
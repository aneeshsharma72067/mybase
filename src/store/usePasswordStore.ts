import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { createZustandStorage } from '../lib/storage'
import { generateId } from '../lib/utils'
import type { PasswordEntry, PasswordStoreState, VaultState } from '../types/password.types'

type PasswordStoreActions = {
  unlockVault: (masterPassword: string) => boolean
  lockVault: () => void
  addEntry: (entry: Omit<PasswordEntry, 'id' | 'createdAt'>) => void
  updateEntry: (id: string, patch: Partial<PasswordEntry>) => void
  deleteEntry: (id: string) => void
}

export type PasswordStore = PasswordStoreState & PasswordStoreActions

const initialState: PasswordStoreState = {
  entries: [],
  vaultState: 'locked',
}

function resolveVaultState(masterPassword: string): VaultState | null {
  if (masterPassword.trim().length === 0) {
    return null
  }

  return 'unlocked'
}

export const usePasswordStore = create<PasswordStore>()(
  persist(
    immer((set) => ({
      ...initialState,
      unlockVault: (masterPassword) => {
        const nextState = resolveVaultState(masterPassword)

        if (!nextState) {
          return false
        }

        set((state) => {
          state.vaultState = nextState
        })

        return true
      },
      lockVault: () => {
        set((state) => {
          state.vaultState = 'locked'
        })
      },
      addEntry: (entry) => {
        set((state) => {
          state.entries.push({
            ...entry,
            id: generateId(),
            createdAt: new Date().toISOString(),
          })
        })
      },
      updateEntry: (id, patch) => {
        set((state) => {
          const entry = state.entries.find((item) => item.id === id)

          if (entry) {
            Object.assign(entry, patch)
          }
        })
      },
      deleteEntry: (id) => {
        set((state) => {
          state.entries = state.entries.filter((entry) => entry.id !== id)
        })
      },
    })),
    {
      name: 'mybase-passwords',
      storage: createZustandStorage(),
      partialize: (state) => ({ entries: state.entries, vaultState: state.vaultState }),
    },
  ),
)
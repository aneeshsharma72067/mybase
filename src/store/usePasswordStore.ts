import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { createZustandStorage } from '../lib/storage'
import { generateId } from '../lib/utils'
import {
  createVerificationToken,
  decryptEntry,
  decryptText,
  deriveKey,
  encryptEntry,
  encryptText,
  generateSalt,
  saltFromBase64,
  verifyToken,
} from '../lib/crypto'
import type { PasswordEntry, VaultMeta, VaultState } from '../types/password.types'

let activeKey: CryptoKey | null = null

interface PasswordStoreState {
  entries: PasswordEntry[]
  vaultState: VaultState
  meta: VaultMeta | null
  searchQuery: string
}

type AddEntryInput = {
  label: string
  username: string
  plainPassword: string
  url?: string
  notes?: string
}

type UpdateEntryInput = {
  label?: string
  username?: string
  plainPassword?: string
  url?: string
  notes?: string
}

type PasswordStoreActions = {
  setupVault: (masterPassword: string) => Promise<void>
  unlockVault: (masterPassword: string) => Promise<boolean>
  changeMasterPassword: (currentPassword: string, nextPassword: string) => Promise<boolean>
  lockVault: () => void
  addEntry: (plain: AddEntryInput) => Promise<void>
  updateEntry: (id: string, plain: UpdateEntryInput) => Promise<void>
  deleteEntry: (id: string) => void
  decryptEntryById: (id: string) => Promise<string>
  setSearchQuery: (query: string) => void
}

export type PasswordStore = PasswordStoreState & PasswordStoreActions

function createSeedEntry(input: {
  id: string
  label: string
  username: string
  strengthSource: string
  url?: string
  notes?: string
  createdAt: string
}): PasswordEntry {
  return {
    id: input.id,
    label: input.label,
    username: input.username,
    ciphertext: '',
    iv: '',
    url: input.url,
    notes: input.notes,
    strength: calculateStrength(input.strengthSource),
    createdAt: input.createdAt,
    updatedAt: input.createdAt,
  }
}

const seedEntries: PasswordEntry[] = [
  createSeedEntry({
    id: 'pwd-protonmail',
    label: 'ProtonMail',
    username: 'alara.woods@proton.me',
    strengthSource: 'ForestVault#2026',
    url: 'https://mail.proton.me',
    notes: 'Primary secure email account',
    createdAt: '2026-04-01T09:10:00.000Z',
  }),
  createSeedEntry({
    id: 'pwd-github',
    label: 'GitHub',
    username: 'alarawoods',
    strengthSource: 'RepoBloom!443',
    url: 'https://github.com',
    notes: 'Personal repositories',
    createdAt: '2026-04-02T08:00:00.000Z',
  }),
  createSeedEntry({
    id: 'pwd-notion',
    label: 'Notion',
    username: 'alara.woods@gmail.com',
    strengthSource: 'Notion7',
    url: 'https://notion.so',
    notes: 'Planning workspace',
    createdAt: '2026-04-03T12:20:00.000Z',
  }),
  createSeedEntry({
    id: 'pwd-amazon',
    label: 'Amazon',
    username: 'alara.woods@gmail.com',
    strengthSource: 'Cart?8',
    url: 'https://amazon.com',
    notes: 'Shopping account',
    createdAt: '2026-04-05T17:40:00.000Z',
  }),
]

const initialState: PasswordStoreState = {
  entries: seedEntries,
  vaultState: 'uninitialized',
  meta: null,
  searchQuery: '',
}

export function calculateStrength(plainPassword: string): 'weak' | 'fair' | 'strong' {
  const hasUppercase = /[A-Z]/.test(plainPassword)
  const hasNumbers = /\d/.test(plainPassword)
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{}|;':",.<>?/`~\\]/.test(plainPassword)

  if (plainPassword.length >= 12 && hasUppercase && hasNumbers && hasSpecial) {
    return 'strong'
  }

  if (plainPassword.length >= 8 && (hasNumbers || hasSpecial) && !(hasNumbers && hasSpecial)) {
    return 'fair'
  }

  return 'weak'
}

export function getSecurityHealth(entries: PasswordEntry[]): {
  secure: number
  fair: number
  atRisk: number
  percentage: number
  status: string
} {
  const secure = entries.filter((entry) => entry.strength === 'strong').length
  const fair = entries.filter((entry) => entry.strength === 'fair').length
  const atRisk = entries.filter((entry) => entry.strength === 'weak').length
  const total = entries.length
  const percentage = total > 0 ? Math.round((secure / total) * 100) : 0

  let status = 'At Risk'

  if (percentage >= 80) {
    status = 'Flourishing'
  } else if (percentage >= 50) {
    status = 'Moderate'
  }

  return {
    secure,
    fair,
    atRisk,
    percentage,
    status,
  }
}

export const usePasswordStore = create<PasswordStore>()(
  persist(
    immer((set, get) => ({
      ...initialState,
      setupVault: async (masterPassword) => {
        if (get().vaultState !== 'uninitialized') {
          return
        }

        const salt = await generateSalt()
        const key = await deriveKey(masterPassword, saltFromBase64(salt))
        const verificationToken = await createVerificationToken(key)

        set((state) => {
          state.meta = {
            salt,
            verificationToken,
          }
          state.vaultState = 'unlocked'
        })

        activeKey = key
      },
      unlockVault: async (masterPassword) => {
        const { meta } = get()

        if (!meta) {
          return false
        }

        const key = await deriveKey(masterPassword, saltFromBase64(meta.salt))
        const isValid = await verifyToken(meta.verificationToken, key)

        if (!isValid) {
          return false
        }

        activeKey = key

        set((state) => {
          state.vaultState = 'unlocked'
        })

        return true
      },
      changeMasterPassword: async (currentPassword, nextPassword) => {
        const { meta, entries } = get()

        if (!meta) {
          return false
        }

        const currentKey = await deriveKey(currentPassword, saltFromBase64(meta.salt))
        const isCurrentPasswordValid = await verifyToken(meta.verificationToken, currentKey)

        if (!isCurrentPasswordValid) {
          return false
        }

        const nextSalt = await generateSalt()
        const nextKey = await deriveKey(nextPassword, saltFromBase64(nextSalt))
        const nextVerificationToken = await createVerificationToken(nextKey)

        const reencryptedEntries = await Promise.all(
          entries.map(async (entry) => {
            if (!entry.ciphertext || !entry.iv) {
              return {
                id: entry.id,
                ciphertext: entry.ciphertext,
                iv: entry.iv,
              }
            }

            const plainPassword = await decryptText(entry.ciphertext, entry.iv, currentKey)
            const encrypted = await encryptText(plainPassword, nextKey)

            return {
              id: entry.id,
              ciphertext: encrypted.ciphertext,
              iv: encrypted.iv,
            }
          }),
        )

        const encryptedById = new Map(
          reencryptedEntries.map((entry) => [entry.id, { ciphertext: entry.ciphertext, iv: entry.iv }]),
        )

        set((state) => {
          state.meta = {
            salt: nextSalt,
            verificationToken: nextVerificationToken,
          }

          state.entries = state.entries.map((entry) => {
            const encrypted = encryptedById.get(entry.id)

            if (!encrypted) {
              return entry
            }

            return {
              ...entry,
              ciphertext: encrypted.ciphertext,
              iv: encrypted.iv,
              updatedAt: new Date().toISOString(),
            }
          })

          state.vaultState = 'unlocked'
        })

        activeKey = nextKey
        return true
      },
      lockVault: () => {
        activeKey = null

        set((state) => {
          state.vaultState = 'locked'
        })
      },
      addEntry: async (plain) => {
        if (!activeKey) {
          throw new Error('Vault is locked')
        }

        const encrypted = await encryptEntry(plain.plainPassword, activeKey)
        const now = new Date().toISOString()

        set((state) => {
          state.entries.push({
            id: generateId(),
            label: plain.label,
            username: plain.username,
            ciphertext: encrypted.ciphertext,
            iv: encrypted.iv,
            url: plain.url,
            notes: plain.notes,
            strength: calculateStrength(plain.plainPassword),
            createdAt: now,
            updatedAt: now,
          })
        })
      },
      updateEntry: async (id, plain) => {
        if (!activeKey) {
          throw new Error('Vault is locked')
        }

        let encryptedPatch: { ciphertext: string; iv: string } | null = null
        let strengthPatch: PasswordEntry['strength'] | null = null

        if (plain.plainPassword) {
          encryptedPatch = await encryptEntry(plain.plainPassword, activeKey)
          strengthPatch = calculateStrength(plain.plainPassword)
        }

        set((state) => {
          const entry = state.entries.find((item) => item.id === id)

          if (entry) {
            if (plain.label !== undefined) {
              entry.label = plain.label
            }
            if (plain.username !== undefined) {
              entry.username = plain.username
            }
            if (plain.url !== undefined) {
              entry.url = plain.url || undefined
            }
            if (plain.notes !== undefined) {
              entry.notes = plain.notes || undefined
            }
            if (encryptedPatch) {
              entry.ciphertext = encryptedPatch.ciphertext
              entry.iv = encryptedPatch.iv
            }
            if (strengthPatch) {
              entry.strength = strengthPatch
            }

            entry.updatedAt = new Date().toISOString()
          }
        })
      },
      deleteEntry: (id) => {
        set((state) => {
          state.entries = state.entries.filter((entry) => entry.id !== id)
        })
      },
      decryptEntryById: async (id) => {
        if (!activeKey) {
          throw new Error('Vault is locked')
        }

        const entry = get().entries.find((item) => item.id === id)

        if (!entry) {
          throw new Error('Entry not found')
        }

        if (!entry.ciphertext) {
          return 'Set up vault to decrypt'
        }

        return decryptEntry(entry.ciphertext, entry.iv, activeKey)
      },
      setSearchQuery: (query) => {
        set((state) => {
          state.searchQuery = query
        })
      },
    })),
    {
      name: 'mybase-passwords',
      storage: createZustandStorage(),
      partialize: (state) => ({
        entries: state.entries,
        meta: state.meta,
        searchQuery: state.searchQuery,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return
        }

        activeKey = null
        state.vaultState = state.meta ? 'locked' : 'uninitialized'
      },
    },
  ),
)
export interface PasswordEntry {
  id: string
  label: string
  username: string
  encryptedPassword: string
  url?: string
  notes?: string
  createdAt: string
}

export type VaultState = 'locked' | 'unlocked'

export interface PasswordStoreState {
  entries: PasswordEntry[]
  vaultState: VaultState
}
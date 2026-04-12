export type VaultState = 'locked' | 'unlocked' | 'uninitialized'

export interface PasswordEntry {
  id: string
  label: string
  username: string
  ciphertext: string
  iv: string
  url?: string
  notes?: string
  strength: 'weak' | 'fair' | 'strong'
  createdAt: string
  updatedAt: string
}

export interface VaultMeta {
  salt: string
  verificationToken: {
    ciphertext: string
    iv: string
  }
}
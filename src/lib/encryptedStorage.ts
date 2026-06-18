import type { StateStorage } from 'zustand/middleware'
import { createJSONStorage } from 'zustand/middleware'
import { decryptText, encryptText } from './crypto'
import { getVaultKey } from './vaultKey'

/**
 * Storage adapter that transparently encrypts persisted store state with the
 * shared vault key when app-wide encryption is enabled.
 *
 * Encryption is opt-in. The module-level `dataEncryptionEnabled` flag mirrors
 * the user's setting and is initialised from localStorage before any store is
 * created (see `initDataEncryptionFlag`).
 *
 * Locked-but-encrypted is the dangerous state: the key is absent, so reads
 * return null and stores initialise empty. Writes MUST be suppressed in that
 * state, otherwise the empty store would overwrite the on-disk ciphertext and
 * permanently destroy data. `setItem` enforces this.
 */

interface EncryptedEnvelope {
  __mbenc: 1
  ct: string
  iv: string
}

let dataEncryptionEnabled = false

export function setDataEncryptionEnabled(enabled: boolean): void {
  dataEncryptionEnabled = enabled
}

export function isDataEncryptionEnabled(): boolean {
  return dataEncryptionEnabled
}

/** Read the persisted `encryptData` setting directly (settings stays plaintext). */
export function initDataEncryptionFlag(settingsKey: string): void {
  if (typeof window === 'undefined') {
    return
  }

  const raw = window.localStorage.getItem(settingsKey)

  if (!raw) {
    return
  }

  try {
    const parsed = JSON.parse(raw) as { state?: { settings?: { encryptData?: boolean } } }
    dataEncryptionEnabled = parsed.state?.settings?.encryptData === true
  } catch {
    dataEncryptionEnabled = false
  }
}

function isEnvelope(value: unknown): value is EncryptedEnvelope {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as EncryptedEnvelope).__mbenc === 1 &&
    typeof (value as EncryptedEnvelope).ct === 'string' &&
    typeof (value as EncryptedEnvelope).iv === 'string'
  )
}

function rawStorage(): StateStorage {
  return {
    getItem: (name) => window.localStorage.getItem(name),
    setItem: (name, value) => window.localStorage.setItem(name, value),
    removeItem: (name) => window.localStorage.removeItem(name),
  }
}

/**
 * The encrypting StateStorage. getItem/setItem are async because crypto is.
 * Zustand's persist middleware awaits them.
 */
function encryptedStateStorage(): StateStorage {
  return {
    getItem: async (name) => {
      if (typeof window === 'undefined') {
        return null
      }

      const stored = window.localStorage.getItem(name)

      if (stored === null) {
        return null
      }

      let parsed: unknown

      try {
        parsed = JSON.parse(stored)
      } catch {
        return null
      }

      if (!isEnvelope(parsed)) {
        // Plaintext (encryption off, or not yet migrated) — pass through.
        return stored
      }

      const key = getVaultKey()

      if (!key) {
        // Encrypted but locked: cannot decrypt. Store stays empty until unlock.
        return null
      }

      try {
        return await decryptText(parsed.ct, parsed.iv, key)
      } catch {
        return null
      }
    },

    setItem: async (name, value) => {
      if (typeof window === 'undefined') {
        return
      }

      if (!dataEncryptionEnabled) {
        window.localStorage.setItem(name, value)
        return
      }

      const key = getVaultKey()

      if (!key) {
        // Encrypted + locked: refuse to write so we never clobber ciphertext
        // with the empty in-memory state that exists before unlock.
        return
      }

      const { ciphertext, iv } = await encryptText(value, key)
      const envelope: EncryptedEnvelope = { __mbenc: 1, ct: ciphertext, iv }
      window.localStorage.setItem(name, JSON.stringify(envelope))
    },

    removeItem: (name) => {
      if (typeof window === 'undefined') {
        return
      }

      window.localStorage.removeItem(name)
    },
  }
}

export function createEncryptedStorage() {
  return createJSONStorage(() => encryptedStateStorage())
}

export { rawStorage }

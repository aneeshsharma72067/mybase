import { createJSONStorage, type StateStorage } from 'zustand/middleware'

export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') {
    return
  }

  const serialized = JSON.stringify(data)

  if (serialized === undefined) {
    return
  }

  window.localStorage.setItem(key, serialized)
}

export function loadFromStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null
  }

  const storedValue = window.localStorage.getItem(key)

  if (!storedValue) {
    return null
  }

  try {
    return JSON.parse(storedValue) as T
  } catch {
    return null
  }
}

/**
 * Parse a zustand persist payload from raw localStorage text. createZustandStorage
 * wraps createJSONStorage, so values are JSON-stringified twice; one parse is not
 * enough for direct localStorage reads (e.g. initDataEncryptionFlag on boot).
 */
export function parsePersistedStorageRaw(raw: string): unknown {
  let parsed: unknown = JSON.parse(raw)

  if (typeof parsed === 'string') {
    parsed = JSON.parse(parsed)
  }

  return parsed
}

export function createPersistStorage(): StateStorage {
  return {
    getItem: (name) => loadFromStorage<string>(name),
    setItem: (name, value) => saveToStorage(name, value),
    removeItem: (name) => {
      if (typeof window === 'undefined') {
        return
      }

      window.localStorage.removeItem(name)
    },
  }
}

export function createZustandStorage() {
  return createJSONStorage(() => createPersistStorage())
}

/**
 * Build a persist `migrate` that merges the persisted payload over a set of
 * defaults. This is the safe default migration: existing (unversioned, i.e.
 * v0) data is preserved key-by-key, any keys added in a newer schema fall back
 * to their default, and a corrupt/non-object payload resets to defaults rather
 * than crashing hydration. Pass the same shape the store's `partialize` emits.
 */
export function createMergeMigrate<T extends Record<string, unknown>>(
  defaults: T,
): (persistedState: unknown) => T {
  return (persistedState) => {
    if (persistedState && typeof persistedState === 'object' && !Array.isArray(persistedState)) {
      return { ...defaults, ...(persistedState as Partial<T>) }
    }

    return { ...defaults }
  }
}
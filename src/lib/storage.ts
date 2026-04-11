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
/**
 * Shared holder for the derived master CryptoKey.
 *
 * Both the password vault and the app-wide data encryption use the same
 * unified master password, so the derived key lives here rather than inside
 * a single store. It is module-local (never persisted) and is cleared on lock.
 */
let activeKey: CryptoKey | null = null

type KeyListener = (key: CryptoKey | null) => void

const listeners = new Set<KeyListener>()

export function getVaultKey(): CryptoKey | null {
  return activeKey
}

export function setVaultKey(key: CryptoKey | null): void {
  activeKey = key

  for (const listener of listeners) {
    listener(key)
  }
}

export function clearVaultKey(): void {
  setVaultKey(null)
}

/** Subscribe to key changes (e.g. to rehydrate encrypted stores on unlock). */
export function subscribeVaultKey(listener: KeyListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

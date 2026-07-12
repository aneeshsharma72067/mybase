import { decryptText, encryptText } from './crypto'

/**
 * localStorage keys for the stores covered by app-wide data encryption.
 * The passwords vault is excluded (already encrypted at the field level) and
 * settings/app stay plaintext so the unlock screen can render and the app can
 * tell it has been set up.
 */
export const ENCRYPTED_STORE_KEYS = [
  'mybase-health',
  'mybase-thoughts',
  'mybase-goals',
  'mybase-todos',
  'mybase-bookmarks',
  'mybase-income',
] as const

interface EncryptedEnvelope {
  __mbenc: 1
  ct: string
  iv: string
}

function isEnvelopeString(raw: string): boolean {
  try {
    const parsed = JSON.parse(raw) as Partial<EncryptedEnvelope>
    return parsed.__mbenc === 1 && typeof parsed.ct === 'string' && typeof parsed.iv === 'string'
  } catch {
    return false
  }
}

/**
 * Rehydrate callbacks registered by each encrypted store. Calling them after
 * the key changes (unlock) reloads store state from the now-decryptable disk.
 */
const rehydrateCallbacks = new Set<() => Promise<void> | void>()

export function registerEncryptedRehydrate(callback: () => Promise<void> | void): void {
  rehydrateCallbacks.add(callback)
}

export async function rehydrateEncryptedStores(): Promise<void> {
  await Promise.all(Array.from(rehydrateCallbacks, (callback) => callback()))
}

/**
 * Encrypt every plaintext store payload in place. Idempotent: entries already
 * wrapped in an envelope are skipped. Used when the user enables encryption.
 *
 * Encrypts everything into memory first, then writes in a second pass, so a
 * failure mid-encryption (e.g. a crypto error) cannot leave some stores
 * encrypted and others plaintext.
 */
export async function encryptAllStores(key: CryptoKey): Promise<void> {
  const envelopes: Array<{ storeKey: string; serialized: string }> = []

  for (const storeKey of ENCRYPTED_STORE_KEYS) {
    const raw = window.localStorage.getItem(storeKey)

    if (raw === null || isEnvelopeString(raw)) {
      continue
    }

    const { ciphertext, iv } = await encryptText(raw, key)
    const envelope: EncryptedEnvelope = { __mbenc: 1, ct: ciphertext, iv }
    envelopes.push({ storeKey, serialized: JSON.stringify(envelope) })
  }

  for (const { storeKey, serialized } of envelopes) {
    window.localStorage.setItem(storeKey, serialized)
  }
}

/**
 * Re-encrypt every encrypted store payload from one key to another. Used when
 * the master password changes while app-wide encryption is enabled, so the
 * stores stay readable with the new key. Decrypts all with oldKey first, then
 * writes with newKey, so a failure cannot leave data half-converted.
 */
export async function reencryptAllStores(oldKey: CryptoKey, newKey: CryptoKey): Promise<void> {
  const plaintexts: Array<{ storeKey: string; plaintext: string }> = []

  for (const storeKey of ENCRYPTED_STORE_KEYS) {
    const raw = window.localStorage.getItem(storeKey)

    if (raw === null || !isEnvelopeString(raw)) {
      continue
    }

    const envelope = JSON.parse(raw) as EncryptedEnvelope
    plaintexts.push({ storeKey, plaintext: await decryptText(envelope.ct, envelope.iv, oldKey) })
  }

  for (const { storeKey, plaintext } of plaintexts) {
    const { ciphertext, iv } = await encryptText(plaintext, newKey)
    const envelope: EncryptedEnvelope = { __mbenc: 1, ct: ciphertext, iv }
    window.localStorage.setItem(storeKey, JSON.stringify(envelope))
  }
}

/**
 * Decrypt every encrypted store payload back to plaintext in place. Used when
 * the user disables encryption. Throws if any entry fails to decrypt (wrong
 * key) so the caller can abort without leaving data half-converted.
 */
export async function decryptAllStores(key: CryptoKey): Promise<void> {
  const decrypted: Array<{ storeKey: string; plaintext: string }> = []

  for (const storeKey of ENCRYPTED_STORE_KEYS) {
    const raw = window.localStorage.getItem(storeKey)

    if (raw === null || !isEnvelopeString(raw)) {
      continue
    }

    const envelope = JSON.parse(raw) as EncryptedEnvelope
    const plaintext = await decryptText(envelope.ct, envelope.iv, key)
    decrypted.push({ storeKey, plaintext })
  }

  // Only write after all succeed, so a bad key cannot partially convert.
  for (const { storeKey, plaintext } of decrypted) {
    window.localStorage.setItem(storeKey, plaintext)
  }
}

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()
const VERIFICATION_TEXT = 'MYBASE_VAULT_VERIFIED'

function bytesToBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes
}

function normalizeBytes(bytes: Uint8Array): Uint8Array {
  const normalized = new Uint8Array(bytes.byteLength)
  normalized.set(bytes)
  return normalized
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
}

export async function deriveKey(masterPassword: string, salt: Uint8Array): Promise<CryptoKey> {
  const normalizedSalt = normalizeBytes(salt)
  const keyMaterial = await window.crypto.subtle.importKey('raw', textEncoder.encode(masterPassword), 'PBKDF2', false, [
    'deriveKey',
  ])

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: toArrayBuffer(normalizedSalt),
      iterations: 310000,
      hash: 'SHA-256',
    },
    keyMaterial,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function encryptText(plaintext: string, key: CryptoKey): Promise<{ ciphertext: string; iv: string }> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12))
  const encoded = textEncoder.encode(plaintext)
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encoded,
  )

  return {
    ciphertext: bytesToBase64(new Uint8Array(encrypted)),
    iv: bytesToBase64(iv),
  }
}

export async function decryptText(ciphertext: string, iv: string, key: CryptoKey): Promise<string> {
  const ciphertextBytes = normalizeBytes(base64ToBytes(ciphertext))
  const ivBytes = normalizeBytes(base64ToBytes(iv))
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: toArrayBuffer(ivBytes),
    },
    key,
    toArrayBuffer(ciphertextBytes),
  )

  return textDecoder.decode(decrypted)
}

export async function generateSalt(): Promise<string> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16))
  return bytesToBase64(salt)
}

export function saltFromBase64(b64: string): Uint8Array {
  return base64ToBytes(b64)
}

export async function encryptEntry(plainPassword: string, key: CryptoKey): Promise<{ ciphertext: string; iv: string }> {
  return encryptText(plainPassword, key)
}

export async function decryptEntry(ciphertext: string, iv: string, key: CryptoKey): Promise<string> {
  return decryptText(ciphertext, iv, key)
}

export async function createVerificationToken(key: CryptoKey): Promise<{ ciphertext: string; iv: string }> {
  return encryptText(VERIFICATION_TEXT, key)
}

export async function verifyToken(
  token: { ciphertext: string; iv: string },
  key: CryptoKey,
): Promise<boolean> {
  try {
    const decrypted = await decryptText(token.ciphertext, token.iv, key)
    return decrypted === VERIFICATION_TEXT
  } catch {
    return false
  }
}
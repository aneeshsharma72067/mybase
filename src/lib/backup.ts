import { getTodayISO } from './utils'

/**
 * All localStorage keys owned by MyBase stores. Keep in sync with the
 * `name` field of each zustand persist config.
 */
export const MYBASE_STORAGE_KEYS = [
  'mybase-app',
  'mybase-settings',
  'mybase-health',
  'mybase-bookmarks',
  'mybase-thoughts',
  'mybase-goals',
  'mybase-passwords',
  'mybase-income',
  'mybase-todos',
] as const

const BACKUP_FORMAT = 'mybase-backup'
const BACKUP_VERSION = 1

export interface BackupFile {
  format: typeof BACKUP_FORMAT
  version: number
  exportedAt: string
  app: string
  data: Record<string, unknown>
}

/**
 * Snapshot every MyBase store from localStorage into a single backup object.
 * The password vault is included as-is: it stays encrypted (ciphertext + salt),
 * so the backup cannot expose secrets without the master password.
 */
export function buildBackup(): BackupFile {
  const data: Record<string, unknown> = {}

  for (const key of MYBASE_STORAGE_KEYS) {
    const raw = window.localStorage.getItem(key)

    if (raw === null) {
      continue
    }

    try {
      data[key] = JSON.parse(raw)
    } catch {
      // Skip corrupt entries rather than aborting the whole export.
    }
  }

  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    app: 'MyBase',
    data,
  }
}

/** Trigger a browser download of the backup as a timestamped JSON file. */
export function downloadBackup(): void {
  const backup = buildBackup()
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = `mybase-backup-${getTodayISO()}.json`
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export interface BackupSummary {
  exportedAt: string
  keys: string[]
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Validate a parsed backup payload. Returns a summary of recognised stores,
 * or throws with a human-readable message if the file is not a MyBase backup.
 */
export function validateBackup(payload: unknown): BackupSummary {
  if (!isPlainObject(payload)) {
    throw new Error('File is not a valid backup.')
  }

  if (payload.format !== BACKUP_FORMAT) {
    throw new Error('This file is not a MyBase backup.')
  }

  if (typeof payload.version !== 'number' || payload.version > BACKUP_VERSION) {
    throw new Error('This backup was created by a newer version of MyBase.')
  }

  if (!isPlainObject(payload.data)) {
    throw new Error('Backup is missing its data section.')
  }

  const keys = Object.keys(payload.data).filter((key) =>
    (MYBASE_STORAGE_KEYS as readonly string[]).includes(key),
  )

  if (keys.length === 0) {
    throw new Error('Backup contains no recognisable MyBase data.')
  }

  return {
    exportedAt: typeof payload.exportedAt === 'string' ? payload.exportedAt : '',
    keys,
  }
}

/**
 * Restore a validated backup into localStorage, replacing current data.
 * Only keys that belong to MyBase are written. The caller is expected to
 * reload the page afterwards so every store rehydrates from storage.
 */
export function restoreBackup(payload: BackupFile): BackupSummary {
  const summary = validateBackup(payload)

  for (const key of MYBASE_STORAGE_KEYS) {
    const value = (payload.data as Record<string, unknown>)[key]

    if (value === undefined) {
      continue
    }

    window.localStorage.setItem(key, JSON.stringify(value))
  }

  return summary
}

/** Parse a backup file's text, validate it, and restore it. */
export async function importBackupFromFile(file: File): Promise<BackupSummary> {
  const text = await file.text()

  let parsed: unknown

  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('File is not valid JSON.')
  }

  return restoreBackup(parsed as BackupFile)
}

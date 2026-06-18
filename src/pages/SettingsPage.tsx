import { Database, Download, KeyRound, Lock, Palette, Shield, Upload, User } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ChangeMasterPasswordModal } from '../components/settings/ChangeMasterPasswordModal'
import { EncryptionSetupModal } from '../components/settings/EncryptionSetupModal'
import { ImportConfirmModal } from '../components/settings/ImportConfirmModal'
import { SettingsHeader } from '../components/settings/SettingsHeader'
import { SettingsSection } from '../components/settings/SettingsSection'
import { SettingsSwitchRow } from '../components/settings/SettingsSwitchRow'
import { downloadBackup, importBackupFromFile, validateBackup, type BackupSummary } from '../lib/backup'
import { decryptAllStores, encryptAllStores } from '../lib/dataEncryption'
import { setDataEncryptionEnabled } from '../lib/encryptedStorage'
import { applyAccent, applyBorderStyle, applyTheme } from '../lib/settingsAppearance'
import { fileToDataUrl, MAX_AVATAR_BYTES } from '../lib/utils'
import { getVaultKey } from '../lib/vaultKey'
import { usePasswordStore } from '../store/usePasswordStore'
import { useSettingsStore } from '../store/useSettingsStore'
import type { SettingsAccent, SettingsBorderStyle, UserSettings } from '../types/settings.types'

const accentMap: Record<SettingsAccent, { label: string; color: string }> = {
  primary: { label: 'Forest Green', color: '#3f6754' },
  secondary: { label: 'Earthy Teal', color: '#40665d' },
  tertiary: { label: 'Soft Botanical', color: '#2c6a4e' },
  orange: { label: 'Warm Orange', color: '#b76a2d' },
  blue: { label: 'Calm Blue', color: '#2f5fa8' },
}

const autoLockOptions: Array<{ label: string; value: UserSettings['autoLockMinutes'] }> = [
  { label: '5 Minutes', value: 5 },
  { label: '15 Minutes', value: 15 },
  { label: '1 Hour', value: 60 },
  { label: 'Never', value: 0 },
]

const borderStyleOptions: Array<{ value: SettingsBorderStyle; label: string; hint: string }> = [
  { value: 'smooth', label: 'Smooth', hint: 'Rounded corners' },
  { value: 'sharp', label: 'Sharp', hint: 'Crisp edges' },
]

export function SettingsPage() {
  const savedSettings = useSettingsStore((state) => state.settings)
  const setSettings = useSettingsStore((state) => state.setSettings)
  const patchSettings = useSettingsStore((state) => state.patchSettings)
  const changeMasterPassword = usePasswordStore((state) => state.changeMasterPassword)
  const setupVault = usePasswordStore((state) => state.setupVault)
  const vaultMeta = usePasswordStore((state) => state.meta)
  const [draft, setDraft] = useState(savedSettings)
  const [statusText, setStatusText] = useState('Adjust your setup and save when ready')
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [changePasswordError, setChangePasswordError] = useState('')
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const backupInputRef = useRef<HTMLInputElement>(null)
  const [pendingImport, setPendingImport] = useState<{ file: File; summary: BackupSummary } | null>(null)
  const [isEncryptionModalOpen, setIsEncryptionModalOpen] = useState(false)
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [encryptionError, setEncryptionError] = useState('')

  // Whether enabling encryption needs to create a master password (no vault yet).
  const needsPasswordSetup = vaultMeta === null

  function handleEncryptionToggle(next: boolean) {
    setEncryptionError('')

    if (next) {
      // Enabling: a confirmation + (maybe) password setup is required.
      setIsEncryptionModalOpen(true)
      return
    }

    void handleDisableEncryption()
  }

  async function handleConfirmEnableEncryption(password: string) {
    setEncryptionError('')
    setIsEncrypting(true)

    try {
      // Ensure a key exists: create the vault if needed, otherwise the vault
      // must already be unlocked so the key is in memory.
      if (needsPasswordSetup) {
        await setupVault(password)
      } else if (getVaultKey() === null) {
        setEncryptionError('Unlock your vault in Passwords first, then try again.')
        return
      }

      const key = getVaultKey()

      if (!key) {
        setEncryptionError('Could not access encryption key. Please try again.')
        return
      }

      // Flip the flag BEFORE migrating so subsequent store writes encrypt.
      setDataEncryptionEnabled(true)
      await encryptAllStores(key)
      patchSettings({ encryptData: true })

      setIsEncryptionModalOpen(false)
      setStatusText('All data is now encrypted')
    } catch {
      setDataEncryptionEnabled(false)
      setEncryptionError('Encryption failed. Your data was not changed.')
    } finally {
      setIsEncrypting(false)
    }
  }

  async function handleDisableEncryption() {
    const key = getVaultKey()

    if (!key) {
      setStatusText('Unlock the app before disabling encryption')
      return
    }

    try {
      await decryptAllStores(key)
      setDataEncryptionEnabled(false)
      patchSettings({ encryptData: false })
      setStatusText('Encryption disabled — data stored as plain text')
    } catch {
      setStatusText('Could not disable encryption')
    }
  }

  function handleExport() {
    try {
      downloadBackup()
      setStatusText('Backup downloaded')
    } catch {
      setStatusText('Could not create backup')
    }
  }

  async function handleBackupFileSelected(file: File | undefined) {
    if (!file) {
      return
    }

    try {
      const summary = validateBackup(JSON.parse(await file.text()))
      setPendingImport({ file, summary })
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : 'Invalid backup file')
    }
  }

  async function handleConfirmImport() {
    if (!pendingImport) {
      return
    }

    try {
      await importBackupFromFile(pendingImport.file)
      window.location.reload()
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : 'Restore failed')
      setPendingImport(null)
    }
  }

  async function handleAvatarChange(file: File | undefined) {
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setStatusText('Please choose an image file')
      return
    }

    if (file.size > MAX_AVATAR_BYTES) {
      setStatusText('Image must be under 2 MB')
      return
    }

    try {
      updateDraft({ avatarUrl: await fileToDataUrl(file) })
      setStatusText('Avatar updated — save to apply')
    } catch {
      setStatusText('Failed to read image')
    }
  }

  useEffect(() => {
    setDraft(savedSettings)
  }, [savedSettings])

  useEffect(() => {
    applyTheme(savedSettings.themeMode)
    applyAccent(savedSettings.accent)
    applyBorderStyle(savedSettings.borderStyle)
  }, [savedSettings])

  useEffect(() => {
    applyTheme(draft.themeMode)
    applyAccent(draft.accent)
    applyBorderStyle(draft.borderStyle)
  }, [draft.accent, draft.borderStyle, draft.themeMode])

  useEffect(() => {
    if (draft.themeMode !== 'auto') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('auto')
    media.addEventListener('change', onChange)

    return () => media.removeEventListener('change', onChange)
  }, [draft.themeMode])

  const hasChanges = useMemo(() => JSON.stringify(draft) !== JSON.stringify(savedSettings), [draft, savedSettings])

  function updateDraft(patch: Partial<UserSettings>) {
    setDraft((current) => ({ ...current, ...patch }))
  }

  function handleSave() {
    setSettings(draft)
    setStatusText('Changes saved')
  }

  function handleDiscard() {
    setDraft(savedSettings)
    setStatusText('Changes discarded')
  }

  function openChangePasswordModal() {
    setChangePasswordError('')
    setIsChangePasswordOpen(true)
  }

  function closeChangePasswordModal() {
    if (isUpdatingPassword) {
      return
    }

    setIsChangePasswordOpen(false)
    setChangePasswordError('')
  }

  async function handleChangeMasterPassword(currentPassword: string, nextPassword: string) {
    setChangePasswordError('')

    if (!vaultMeta) {
      setChangePasswordError('Initialize your vault in Passwords before changing the master password.')
      return
    }

    setIsUpdatingPassword(true)

    try {
      const changed = await changeMasterPassword(currentPassword, nextPassword)

      if (!changed) {
        setChangePasswordError('Current password is incorrect.')
        return
      }

      setIsChangePasswordOpen(false)
      setStatusText('Master password updated')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-6xl pb-24">
      <div className="pointer-events-none absolute right-0 top-0 -z-10 h-64 w-64 rounded-full bg-primary-container/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 left-0 -z-10 h-56 w-56 rounded-full bg-secondary-container/40 blur-3xl" />

      <SettingsHeader statusText={statusText} />

      <div className="mx-auto w-full max-w-5xl space-y-8">
        <SettingsSection title="Profile" icon={User} tone="primary">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="flex flex-col items-center justify-center gap-4 md:col-span-4 md:border-r md:border-outline-variant/20 md:pr-8">
              {draft.avatarUrl ? (
                <img
                  src={draft.avatarUrl}
                  alt="Profile avatar"
                  className="h-28 w-28 rounded-full border-4 border-surface-container-lowest object-cover shadow-lg"
                />
              ) : (
                <span className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-surface-container-lowest bg-primary-container text-4xl font-black text-primary shadow-lg">
                  {draft.displayName.trim().charAt(0).toUpperCase() || '?'}
                </span>
              )}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => void handleAvatarChange(event.target.files?.[0])}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-full bg-surface-container px-4 py-2 text-xs font-bold text-on-surface hover:bg-surface-container-high"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  Change Avatar
                </button>
                {draft.avatarUrl ? (
                  <button
                    type="button"
                    className="rounded-full px-3 py-2 text-xs font-bold text-on-surface-variant hover:text-error"
                    onClick={() => updateDraft({ avatarUrl: '' })}
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            </div>
            <div className="space-y-5 md:col-span-8">
              <label className="block space-y-2">
                <span className="px-1 text-sm font-bold text-on-surface-variant">Display Name</span>
                <input
                  type="text"
                  value={draft.displayName}
                  onChange={(event) => updateDraft({ displayName: event.target.value })}
                  className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
                />
              </label>
              <label className="block space-y-2">
                <span className="px-1 text-sm font-bold text-on-surface-variant">Email Address</span>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(event) => updateDraft({ email: event.target.value })}
                  className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
                />
              </label>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Appearance" icon={Palette} tone="secondary">
          <div className="space-y-10">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-on-surface-variant">Color Theme</h3>
              <div className="grid grid-cols-3 gap-4">
                {([['light', 'Light'], ['dark', 'Dark'], ['auto', 'Auto']] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updateDraft({ themeMode: value })}
                    className={[
                      'rounded-xl border-2 px-4 py-4 text-xs font-bold transition-colors',
                      draft.themeMode === value
                        ? 'border-primary bg-surface-container-lowest text-primary'
                        : 'border-transparent bg-surface-container-high text-on-surface-variant hover:border-outline-variant',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-on-surface-variant">Accent Color</h3>
              <div className="flex flex-wrap gap-4">
                {(Object.keys(accentMap) as SettingsAccent[]).map((accent) => (
                  <button
                    key={accent}
                    type="button"
                    onClick={() => updateDraft({ accent })}
                    className="inline-flex items-center gap-3"
                  >
                    <span
                      className={[
                        'inline-flex h-10 w-10 items-center justify-center rounded-full text-on-primary transition-all',
                        draft.accent === accent ? 'ring-4 ring-primary/20' : '',
                      ].join(' ')}
                      style={{ backgroundColor: accentMap[accent].color }}
                    >
                      {draft.accent === accent ? '✓' : ''}
                    </span>
                    <span className="text-xs font-semibold text-on-surface-variant">{accentMap[accent].label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-on-surface-variant">Corner Style</h3>
              <div className="grid grid-cols-2 gap-4">
                {borderStyleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateDraft({ borderStyle: option.value })}
                    className={[
                      'flex flex-col items-start gap-1 border-2 px-4 py-4 text-left transition-colors',
                      option.value === 'smooth' ? 'rounded-2xl' : 'rounded-none',
                      draft.borderStyle === option.value
                        ? 'border-primary bg-surface-container-lowest text-primary'
                        : 'border-transparent bg-surface-container-high text-on-surface-variant hover:border-outline-variant',
                    ].join(' ')}
                  >
                    <span className="text-sm font-bold">{option.label}</span>
                    <span className="text-xs font-medium text-on-surface-variant">{option.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Security" icon={Shield} tone="error">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-bold text-on-surface">Master Password</p>
                <p className="text-sm text-on-surface-variant">Update the key that protects your private data.</p>
              </div>
              <button
                type="button"
                onClick={openChangePasswordModal}
                className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-surface px-6 py-3 font-bold text-on-surface hover:bg-surface-container"
              >
                <KeyRound size={16} />
                Change Master Password
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant/20 pt-6">
              <div className="flex-1">
                <p className="font-bold text-on-surface">Auto-lock vault</p>
                <p className="text-sm text-on-surface-variant">Automatically secure your base after inactivity.</p>
              </div>
              <select
                value={String(draft.autoLockMinutes)}
                onChange={(event) => updateDraft({ autoLockMinutes: Number(event.target.value) as UserSettings['autoLockMinutes'] })}
                className="rounded-xl border border-outline-variant/50 bg-surface px-4 py-2 font-bold text-on-surface outline-none transition-colors focus:border-primary"
              >
                {autoLockOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t border-outline-variant/20 pt-6">
              <SettingsSwitchRow
                title="Encrypt all data"
                description="Encrypt every module at rest with your master password. Requires unlocking on each visit."
                checked={savedSettings.encryptData}
                onChange={handleEncryptionToggle}
              />
              {savedSettings.encryptData ? (
                <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary-container/40 px-3 py-1 text-xs font-semibold text-primary">
                  <Lock size={12} /> Your data is encrypted on this device
                </p>
              ) : null}
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Data & Backup" icon={Database} tone="tertiary">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-bold text-on-surface">Export backup</p>
                <p className="text-sm text-on-surface-variant">
                  Download all your data as a single JSON file. Your vault stays encrypted.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-surface px-6 py-3 font-bold text-on-surface hover:bg-surface-container"
              >
                <Download size={16} />
                Export
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant/20 pt-6">
              <div className="flex-1">
                <p className="font-bold text-on-surface">Restore backup</p>
                <p className="text-sm text-on-surface-variant">
                  Import a backup file. This replaces all current data.
                </p>
              </div>
              <input
                ref={backupInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(event) => {
                  void handleBackupFileSelected(event.target.files?.[0])
                  event.target.value = ''
                }}
              />
              <button
                type="button"
                onClick={() => backupInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-surface px-6 py-3 font-bold text-on-surface hover:bg-surface-container"
              >
                <Upload size={16} />
                Restore
              </button>
            </div>
          </div>
        </SettingsSection>

        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={handleDiscard}
            className="px-6 py-3 font-bold text-on-surface-variant transition-colors hover:text-primary disabled:opacity-50"
            disabled={!hasChanges}
          >
            Discard changes
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-on-primary shadow-lg transition-transform active:scale-95 disabled:opacity-50"
            disabled={!hasChanges}
          >
            Save Changes
          </button>
        </div>
      </div>

      <ChangeMasterPasswordModal
        isOpen={isChangePasswordOpen}
        isSaving={isUpdatingPassword}
        errorText={changePasswordError}
        onClose={closeChangePasswordModal}
        onSubmit={handleChangeMasterPassword}
      />

      <ImportConfirmModal
        isOpen={pendingImport !== null}
        fileName={pendingImport?.file.name ?? ''}
        exportedAt={pendingImport?.summary.exportedAt ?? ''}
        storeCount={pendingImport?.summary.keys.length ?? 0}
        onConfirm={() => void handleConfirmImport()}
        onClose={() => setPendingImport(null)}
      />

      <EncryptionSetupModal
        isOpen={isEncryptionModalOpen}
        needsPasswordSetup={needsPasswordSetup}
        isSaving={isEncrypting}
        errorText={encryptionError}
        onClose={() => {
          if (!isEncrypting) {
            setIsEncryptionModalOpen(false)
            setEncryptionError('')
          }
        }}
        onConfirm={(password) => void handleConfirmEnableEncryption(password)}
      />
    </div>
  )
}

export default SettingsPage

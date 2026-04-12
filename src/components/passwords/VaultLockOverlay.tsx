import { Fingerprint, Shield } from 'lucide-react'
import type { VaultState } from '../../types/password.types'

interface VaultLockOverlayProps {
  vaultState: VaultState
  setupMasterPassword: string
  confirmMasterPassword: string
  unlockPassword: string
  errorText: string
  isSubmitting: boolean
  onSetupMasterPasswordChange: (value: string) => void
  onConfirmMasterPasswordChange: (value: string) => void
  onUnlockPasswordChange: (value: string) => void
  onSetupSubmit: () => void
  onUnlockSubmit: () => void
}

export function VaultLockOverlay({
  vaultState,
  setupMasterPassword,
  confirmMasterPassword,
  unlockPassword,
  errorText,
  isSubmitting,
  onSetupMasterPasswordChange,
  onConfirmMasterPasswordChange,
  onUnlockPasswordChange,
  onSetupSubmit,
  onUnlockSubmit,
}: VaultLockOverlayProps) {
  if (vaultState === 'unlocked') {
    return null
  }

  const isUninitialized = vaultState === 'uninitialized'

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/40 p-4 backdrop-blur-xl">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-primary/5 bg-surface-container-lowest p-10 text-center shadow-2xl">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative z-10">
          <div className="mx-auto mb-7 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Shield className="text-primary" size={34} />
          </div>
          <h2 className="font-display text-3xl font-black text-on-surface">
            {isUninitialized ? 'Create Your Vault' : 'Vault Locked'}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
            {isUninitialized
              ? 'Choose a master password. It is never stored - only you know it.'
              : 'Your credentials are safely encrypted. Authenticate to access your personal sanctuary vault.'}
          </p>

          {isUninitialized ? (
            <div className="mt-5 space-y-2">
              <input
                type="password"
                value={setupMasterPassword}
                onChange={(event) => onSetupMasterPasswordChange(event.target.value)}
                placeholder="Master password"
                className="w-full rounded-full bg-surface-container-low px-4 py-3 text-sm outline-none"
              />
              <input
                type="password"
                value={confirmMasterPassword}
                onChange={(event) => onConfirmMasterPasswordChange(event.target.value)}
                placeholder="Confirm password"
                className="w-full rounded-full bg-surface-container-low px-4 py-3 text-sm outline-none"
              />
              {errorText ? <p className="text-xs font-semibold text-error">{errorText}</p> : null}
            </div>
          ) : (
            <div className="mt-5 space-y-2">
              <input
                type="password"
                value={unlockPassword}
                onChange={(event) => onUnlockPasswordChange(event.target.value)}
                placeholder="Master password"
                className="w-full rounded-full bg-surface-container-low px-4 py-3 text-sm outline-none"
              />
              {errorText ? <p className="text-xs font-semibold text-error">{errorText}</p> : null}
            </div>
          )}

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={isUninitialized ? onSetupSubmit : onUnlockSubmit}
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-br from-primary to-primary-dim py-3 text-sm font-bold text-on-primary transition-transform active:scale-95"
            >
              <Fingerprint size={14} /> {isSubmitting ? 'Please wait...' : isUninitialized ? 'Create Vault' : 'Unlock Vault'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
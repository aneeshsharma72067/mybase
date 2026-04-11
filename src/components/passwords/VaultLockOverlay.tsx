import { Fingerprint, Shield } from 'lucide-react'

interface VaultLockOverlayProps {
  isLocked: boolean
  showMasterPasswordInput: boolean
  masterPasswordInput: string
  unlockError: string
  onMasterPasswordInputChange: (value: string) => void
  onUnlock: () => void
  onToggleMasterPasswordInput: () => void
}

export function VaultLockOverlay({
  isLocked,
  showMasterPasswordInput,
  masterPasswordInput,
  unlockError,
  onMasterPasswordInputChange,
  onUnlock,
  onToggleMasterPasswordInput,
}: VaultLockOverlayProps) {
  if (!isLocked) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/40 p-4 backdrop-blur-xl">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-primary/5 bg-surface-container-lowest p-10 text-center shadow-2xl">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative z-10">
          <div className="mx-auto mb-7 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Shield className="text-primary" size={34} />
          </div>
          <h2 className="font-display text-3xl font-black text-on-surface">Vault Locked</h2>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
            Your credentials are safely encrypted. Authenticate to access your personal sanctuary vault.
          </p>

          {showMasterPasswordInput ? (
            <div className="mt-5 space-y-2">
              <input
                type="password"
                value={masterPasswordInput}
                onChange={(event) => onMasterPasswordInputChange(event.target.value)}
                placeholder="Enter master password"
                className="w-full rounded-full bg-surface-container-low px-4 py-3 text-sm outline-none"
              />
              {unlockError ? <p className="text-xs font-semibold text-error">{unlockError}</p> : null}
            </div>
          ) : null}

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={onUnlock}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-br from-primary to-primary-dim py-3 text-sm font-bold text-on-primary transition-transform active:scale-95"
            >
              <Fingerprint size={14} /> Unlock Vault
            </button>

            <button
              type="button"
              onClick={onToggleMasterPasswordInput}
              className="text-xs font-bold text-on-surface-variant transition-colors hover:text-primary"
            >
              Use Master Password
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
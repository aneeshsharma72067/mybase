import { AlertTriangle, Lock, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'

interface EncryptionSetupModalProps {
  isOpen: boolean
  /** True when no vault exists yet, so a new master password must be created. */
  needsPasswordSetup: boolean
  isSaving: boolean
  errorText: string
  onClose: () => void
  /** password is empty when a vault already exists (key already derived). */
  onConfirm: (password: string) => void
}

export function EncryptionSetupModal({
  isOpen,
  needsPasswordSetup,
  isSaving,
  errorText,
  onClose,
  onConfirm,
}: EncryptionSetupModalProps) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)
  const [localError, setLocalError] = useState('')

  if (!isOpen) {
    return null
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!acknowledged) {
      setLocalError('Please acknowledge that lost passwords cannot be recovered.')
      return
    }

    if (needsPasswordSetup) {
      if (password.length < 8) {
        setLocalError('Master password must be at least 8 characters.')
        return
      }

      if (password !== confirm) {
        setLocalError('Passwords do not match.')
        return
      }
    }

    setLocalError('')
    onConfirm(needsPasswordSetup ? password : '')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6 backdrop-blur-sm"
      onClick={() => {
        if (!isSaving) {
          onClose()
        }
      }}
    >
      <div
        className="w-full max-w-lg rounded-4xl bg-surface-container-lowest p-6 shadow-2xl md:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-container text-primary">
              <Lock size={20} />
            </span>
            <h3 className="font-display text-xl font-black text-on-surface">Encrypt all data</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
            aria-label="Close encryption dialog"
          >
            <X size={16} />
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <p className="text-sm text-on-surface-variant">
            {needsPasswordSetup
              ? 'Choose a master password. It encrypts all your data and unlocks your vault. It is never stored.'
              : 'Your existing master password will be used to encrypt all your data at rest.'}
          </p>

          {needsPasswordSetup ? (
            <>
              <label className="block space-y-2">
                <span className="px-1 text-sm font-bold text-on-surface-variant">Master Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                />
              </label>
              <label className="block space-y-2">
                <span className="px-1 text-sm font-bold text-on-surface-variant">Confirm Password</span>
                <input
                  type="password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
                  placeholder="Confirm password"
                  autoComplete="new-password"
                />
              </label>
            </>
          ) : null}

          <div className="flex items-start gap-3 rounded-2xl bg-error-container/20 p-4">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-error" />
            <label className="flex items-start gap-3 text-sm text-on-surface">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(event) => setAcknowledged(event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-error"
              />
              <span>
                I understand that if I lose my master password,{' '}
                <strong>my data cannot be recovered.</strong> I have exported a backup.
              </span>
            </label>
          </div>

          {localError || errorText ? (
            <p className="text-sm font-bold text-error">{localError || errorText}</p>
          ) : null}

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl border border-outline-variant bg-surface px-5 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary transition-colors hover:bg-primary-dim disabled:opacity-50"
            >
              <Lock size={14} />
              {isSaving ? 'Encrypting...' : 'Enable encryption'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

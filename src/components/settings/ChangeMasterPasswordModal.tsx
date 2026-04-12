import { X, KeyRound } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'

interface ChangeMasterPasswordModalProps {
  isOpen: boolean
  isSaving: boolean
  errorText: string
  onClose: () => void
  onSubmit: (currentPassword: string, nextPassword: string) => Promise<void>
}

export function ChangeMasterPasswordModal({
  isOpen,
  isSaving,
  errorText,
  onClose,
  onSubmit,
}: ChangeMasterPasswordModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setIsVisible(false)
      return
    }

    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setLocalError('')

    const frame = window.requestAnimationFrame(() => setIsVisible(true))
    return () => window.cancelAnimationFrame(frame)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isSaving) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, isSaving, onClose])

  if (!isOpen) {
    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!currentPassword.trim()) {
      setLocalError('Current password is required')
      return
    }

    if (newPassword.length < 8) {
      setLocalError('New password must be at least 8 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setLocalError('New password and confirmation do not match')
      return
    }

    if (newPassword === currentPassword) {
      setLocalError('New password must be different from current password')
      return
    }

    setLocalError('')
    await onSubmit(currentPassword, newPassword)
  }

  return (
    <div
      className={[
        'fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6 backdrop-blur-sm transition-opacity duration-220 ease-out',
        isVisible ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
      onClick={() => {
        if (!isSaving) {
          onClose()
        }
      }}
    >
      <div
        className={[
          'w-full max-w-lg rounded-4xl bg-surface-container-lowest p-6 shadow-2xl transition-all duration-220 ease-out md:p-8',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        ].join(' ')}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-black text-primary">Change Master Password</h3>
            <p className="mt-1 text-sm text-on-surface-variant">Update the password used to unlock your encrypted vault.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
            aria-label="Close change password modal"
            disabled={isSaving}
          >
            <X size={16} />
          </button>
        </div>

        <form className="space-y-5" onSubmit={(event) => void handleSubmit(event)}>
          <label className="block space-y-2">
            <span className="px-1 text-sm font-bold text-on-surface-variant">Current Password</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
              placeholder="Current password"
              autoComplete="current-password"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="px-1 text-sm font-bold text-on-surface-variant">New Password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </label>

          <label className="block space-y-2">
            <span className="px-1 text-sm font-bold text-on-surface-variant">Confirm New Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
              placeholder="Confirm new password"
              autoComplete="new-password"
              required
            />
          </label>

          {localError || errorText ? (
            <p className="text-sm font-bold text-error">{localError || errorText}</p>
          ) : null}

          <div className="flex items-center justify-end gap-3 pt-2">
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
              <KeyRound size={14} />
              {isSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

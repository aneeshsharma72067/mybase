import { Eye, EyeOff, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { calculateStrength } from '../../store/usePasswordStore'
import type { PasswordEntry } from '../../types/password.types'

interface AddEntryModalProps {
  isOpen: boolean
  editingEntry: PasswordEntry | null
  prefillPassword: string
  isSaving: boolean
  onClose: () => void
  onSave: (payload: {
    label: string
    username: string
    plainPassword?: string
    url?: string
    notes?: string
  }) => Promise<void>
}

function strengthClass(strength: 'weak' | 'fair' | 'strong'): string {
  if (strength === 'strong') {
    return 'bg-primary-container text-on-primary-container'
  }

  if (strength === 'fair') {
    return 'bg-secondary-container text-on-secondary-container'
  }

  return 'bg-error-container/20 text-error'
}

export function AddEntryModal({ isOpen, editingEntry, prefillPassword, isSaving, onClose, onSave }: AddEntryModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [label, setLabel] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [url, setUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [errorText, setErrorText] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setIsVisible(false)
      return
    }

    setLabel(editingEntry?.label ?? '')
    setUsername(editingEntry?.username ?? '')
    setPassword(editingEntry ? '' : prefillPassword)
    setUrl(editingEntry?.url ?? '')
    setNotes(editingEntry?.notes ?? '')
    setErrorText('')
    setShowPassword(false)

    const frame = window.requestAnimationFrame(() => {
      setIsVisible(true)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [editingEntry, isOpen, prefillPassword])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const strength = useMemo(() => {
    if (!password) {
      return null
    }

    return calculateStrength(password)
  }, [password])

  if (!isOpen) {
    return null
  }

  async function handleSubmit() {
    const normalizedLabel = label.trim()
    const normalizedUsername = username.trim()

    if (!normalizedLabel || !normalizedUsername) {
      setErrorText('Label and username are required')
      return
    }

    if (!editingEntry && password.trim().length === 0) {
      setErrorText('Password is required')
      return
    }

    setErrorText('')

    await onSave({
      label: normalizedLabel,
      username: normalizedUsername,
      plainPassword: password.trim() || undefined,
      url: url.trim() || undefined,
      notes: notes.trim() || undefined,
    })
  }

  return (
    <div
      className={[
        'fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6 backdrop-blur-sm transition-opacity duration-220 ease-out',
        isVisible ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
      onClick={onClose}
    >
      <div
        className={[
          'h-[80vh] w-full max-w-lg overflow-y-scroll rounded-[2.5rem] bg-surface-container-lowest p-6 shadow-2xl transition-all duration-220 ease-out md:p-8',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        ].join(' ')}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-black text-[#1b4332]">
              {editingEntry ? 'Edit Password Entry' : 'Add New Password'}
            </h3>
            <p className="mt-1 text-sm text-on-surface-variant">Store a service credential in your encrypted vault.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
            aria-label="Close add entry modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block px-1 text-sm font-bold text-primary" htmlFor="add-entry-label">
              Label
            </label>
            <input
              id="add-entry-label"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="ProtonMail, GitHub, Netflix..."
              className="w-full rounded-2xl border-2 border-surface-container-high bg-surface-container-lowest px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-2 block px-1 text-sm font-bold text-primary" htmlFor="add-entry-username">
              Username
            </label>
            <input
              id="add-entry-username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="email or username"
              className="w-full rounded-2xl border-0 bg-surface-container-low px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-2 block px-1 text-sm font-bold text-primary" htmlFor="add-entry-password">
              Password
            </label>
            <div className="relative">
              <input
                id="add-entry-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={editingEntry ? 'Leave blank to keep current' : 'Password'}
                className="w-full rounded-2xl border-0 bg-surface-container-low px-5 py-4 pr-12 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {strength ? (
              <p className="mt-2">
                <span className={['inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase', strengthClass(strength)].join(' ')}>
                  {strength}
                </span>
              </p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block px-1 text-sm font-bold text-primary" htmlFor="add-entry-url">
              URL
            </label>
            <input
              id="add-entry-url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://..."
              className="w-full rounded-2xl border-0 bg-surface-container-low px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-2 block px-1 text-sm font-bold text-primary" htmlFor="add-entry-notes">
              Notes
            </label>
            <textarea
              id="add-entry-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={2}
              placeholder="Any notes..."
              className="w-full resize-none rounded-2xl border-0 bg-surface-container-low px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {errorText ? <p className="text-xs font-semibold text-error">{errorText}</p> : null}
        </div>

        <div className="mt-6 flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="order-2 rounded-full px-8 py-4 font-bold text-on-surface-variant transition-colors hover:bg-surface-container-high sm:order-1 sm:flex-1"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="order-1 rounded-full bg-[#1b4332] px-8 py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 sm:order-2 sm:flex-1"
          >
            {isSaving ? 'Saving...' : 'Save Entry'}
          </button>
        </div>
      </div>
    </div>
  )
}

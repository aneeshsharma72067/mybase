import { Leaf, Upload } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { fileToDataUrl, MAX_AVATAR_BYTES } from '../../lib/utils'

interface OnboardingModalProps {
  onComplete: (profile: { displayName: string; email: string; avatarUrl: string }) => void
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        // Prevent escape from closing since onboarding is mandatory.
        event.preventDefault()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const items = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(selector) ?? []).filter(
        (element) => !element.hasAttribute('disabled'),
      )

      if (items.length === 0) {
        return
      }

      const first = items[0]
      const last = items[items.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  async function handleAvatarChange(file: File | undefined) {
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file')
      return
    }

    if (file.size > MAX_AVATAR_BYTES) {
      setError('Image must be under 2 MB')
      return
    }

    try {
      setAvatarUrl(await fileToDataUrl(file))
      setError('')
    } catch {
      setError('Failed to read image')
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const name = displayName.trim()

    if (!name) {
      setError('Please enter your name')
      return
    }

    onComplete({ displayName: name, email: email.trim(), avatarUrl })
  }

  const initial = displayName.trim().charAt(0).toUpperCase() || '?'

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-lg rounded-4xl bg-surface-container-lowest p-6 shadow-2xl md:p-8"
      >
        <div className="mb-8 flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container text-primary">
            <Leaf size={22} />
          </span>
          <div>
            <h3 className="font-display text-2xl font-black text-primary">Welcome to MyBase</h3>
            <p className="mt-1 text-sm text-on-surface-variant">Let&apos;s set up your profile to get started.</p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative h-24 w-24 overflow-hidden rounded-full border-4 border-surface-container shadow-lg"
              aria-label="Upload avatar"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar preview" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-primary-container text-3xl font-black text-primary">
                  {initial}
                </span>
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-on-primary opacity-0 transition-opacity group-hover:opacity-100">
                <Upload size={18} />
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => void handleAvatarChange(event.target.files?.[0])}
            />
            <span className="text-xs text-on-surface-variant">Optional — tap to add a photo</span>
          </div>

          <label className="block space-y-2">
            <span className="px-1 text-sm font-bold text-on-surface-variant">Display Name</span>
            <input
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
              placeholder="What should we call you?"
              autoFocus
            />
          </label>

          <label className="block space-y-2">
            <span className="px-1 text-sm font-bold text-on-surface-variant">Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
              placeholder="Optional"
            />
          </label>

          {error ? <p className="text-sm font-bold text-error">{error}</p> : null}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-on-primary shadow-lg transition-transform active:scale-95"
          >
            Enter MyBase
          </button>
        </form>
      </div>
    </div>
  )
}

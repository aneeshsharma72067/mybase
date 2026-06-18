import { Fingerprint, Lock } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { rehydrateEncryptedStores } from '../../lib/dataEncryption'
import { usePasswordStore } from '../../store/usePasswordStore'

/**
 * Full-screen gate shown when app-wide encryption is enabled and the vault is
 * locked. Unlocking derives the master key (shared with the password vault),
 * then rehydrates the encrypted stores from their now-decryptable storage.
 */
export function AppLockScreen() {
  const unlockVault = usePasswordStore((state) => state.unlockVault)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!password) {
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const unlocked = await unlockVault(password)

      if (!unlocked) {
        setError('Incorrect master password.')
        return
      }

      // Key is now set; reload encrypted store state from disk.
      await rehydrateEncryptedStores()
      setPassword('')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-primary/5 bg-surface-container-lowest p-10 text-center shadow-2xl">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative z-10">
          <div className="mx-auto mb-7 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Lock className="text-primary" size={32} />
          </div>
          <h2 className="font-display text-3xl font-black text-on-surface">MyBase is locked</h2>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
            Your data is encrypted. Enter your master password to continue.
          </p>

          <form className="mt-6 space-y-3" onSubmit={(event) => void handleSubmit(event)}>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Master password"
              autoFocus
              autoComplete="current-password"
              className="w-full rounded-full bg-surface-container-low px-4 py-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary/30"
            />
            {error ? <p className="text-xs font-semibold text-error">{error}</p> : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-br from-primary to-primary-dim py-3 text-sm font-bold text-on-primary transition-transform active:scale-95 disabled:opacity-60"
            >
              <Fingerprint size={14} /> {isSubmitting ? 'Unlocking...' : 'Unlock'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

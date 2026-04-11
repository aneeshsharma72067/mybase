import { X } from 'lucide-react'
import type { DraftPasswordEntry } from './passwords.helpers'

interface PasswordEntryModalProps {
  isMounted: boolean
  isVisible: boolean
  draftEntry: DraftPasswordEntry
  onDraftChange: (field: keyof DraftPasswordEntry, value: string) => void
  onClose: () => void
  onSave: () => void
}

export function PasswordEntryModal({
  isMounted,
  isVisible,
  draftEntry,
  onDraftChange,
  onClose,
  onSave,
}: PasswordEntryModalProps) {
  if (!isMounted) {
    return null
  }

  return (
    <div
      className={[
        'fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6 backdrop-blur-sm transition-opacity duration-200',
        isVisible ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
      onClick={onClose}
    >
      <div
        className={[
          'h-[80vh] w-full max-w-lg overflow-y-scroll rounded-[2.5rem] bg-surface-container-lowest p-6 shadow-2xl transition-all duration-220 md:p-8',
          isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0',
        ].join(' ')}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-black text-[#1b4332]">Add New Password</h3>
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
            <label className="mb-2 block px-1 text-sm font-bold text-primary" htmlFor="password-entry-url">
              URL
            </label>
            <input
              id="password-entry-url"
              value={draftEntry.url}
              onChange={(event) => onDraftChange('url', event.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-2xl border-0 bg-surface-container-low px-5 py-4 text-sm font-medium outline-none ring-0 focus:bg-surface-dim focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-2 block px-1 text-sm font-bold text-primary" htmlFor="password-entry-label">
              Service Name
            </label>
            <input
              id="password-entry-label"
              value={draftEntry.label}
              onChange={(event) => onDraftChange('label', event.target.value)}
              placeholder="e.g. ProtonMail"
              className="w-full rounded-2xl border-2 border-surface-container-high bg-surface-container-lowest px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block px-1 text-sm font-bold text-primary" htmlFor="password-entry-username">
                Username / Email
              </label>
              <input
                id="password-entry-username"
                value={draftEntry.username}
                onChange={(event) => onDraftChange('username', event.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-2xl border-0 bg-surface-container-low px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-2 block px-1 text-sm font-bold text-primary" htmlFor="password-entry-password">
                Password
              </label>
              <input
                id="password-entry-password"
                value={draftEntry.password}
                onChange={(event) => onDraftChange('password', event.target.value)}
                placeholder="Enter secure password"
                className="w-full rounded-2xl border-0 bg-surface-container-low px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block px-1 text-sm font-bold text-primary" htmlFor="password-entry-notes">
              Notes (Optional)
            </label>
            <textarea
              id="password-entry-notes"
              value={draftEntry.notes}
              onChange={(event) => onDraftChange('notes', event.target.value)}
              placeholder="Environment, reminders, or recovery hints"
              rows={4}
              className="h-24 w-full resize-none rounded-2xl border-0 bg-surface-container-low px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
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
            onClick={onSave}
            className="order-1 rounded-full bg-[#1b4332] px-8 py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 sm:order-2 sm:flex-1"
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  )
}
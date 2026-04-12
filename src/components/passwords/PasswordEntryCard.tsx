import { Check, Copy, Eye, EyeOff, Pencil } from 'lucide-react'
import { useState } from 'react'
import type { PasswordEntry } from '../../types/password.types'

interface PasswordEntryCardProps {
  entry: PasswordEntry
  faviconUrl: string
  passwordValue: string
  isRevealed: boolean
  isCopied: boolean
  isDecrypting: boolean
  onToggleReveal: (id: string) => void
  onEdit: (entry: PasswordEntry) => void
  onCopy: () => void
}

export function PasswordEntryCard({
  entry,
  faviconUrl,
  passwordValue,
  isRevealed,
  isCopied,
  isDecrypting,
  onToggleReveal,
  onEdit,
  onCopy,
}: PasswordEntryCardProps) {
  const [showFaviconFallback, setShowFaviconFallback] = useState(false)

  return (
    <article className="group flex items-center gap-4 rounded-xl bg-surface-container-lowest p-5 transition-all hover:bg-primary-container/20">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm">
        {faviconUrl && !showFaviconFallback ? (
          <img alt="" className="h-6 w-6" src={faviconUrl} onError={() => setShowFaviconFallback(true)} />
        ) : (
          <span className="text-sm font-bold">{entry.label.slice(0, 1).toUpperCase()}</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-lg font-bold text-on-surface">{entry.label}</h3>
        <p className="truncate text-sm text-on-surface-variant">{entry.username}</p>
      </div>

      <div className="hidden items-center gap-3 md:flex">
        <div className="flex items-center gap-3 rounded-lg bg-surface-container px-3 py-1.5 font-mono text-sm tracking-wider text-on-surface-variant">
          <span>{isRevealed ? passwordValue : '••••••••••••'}</span>
          <button
            type="button"
            onClick={() => onToggleReveal(entry.id)}
            disabled={isDecrypting}
            className="text-outline transition-colors hover:text-primary"
            aria-label={isRevealed ? 'Hide password' : 'Reveal password'}
          >
            {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

        <span
          className={[
            'inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]',
            entry.strength === 'strong'
              ? 'bg-primary-container text-on-primary-container'
              : entry.strength === 'fair'
              ? 'bg-secondary-container text-on-secondary-container'
              : 'bg-error-container/20 text-error',
          ].join(' ')}
        >
          <span
            className={[
              'h-1.5 w-1.5 rounded-full',
              entry.strength === 'strong' ? 'bg-primary' : entry.strength === 'fair' ? 'bg-secondary' : 'bg-error',
            ].join(' ')}
          />
          {entry.strength}
        </span>

        <button
          type="button"
          onClick={() => onEdit(entry)}
          className="rounded-full bg-surface-container-low p-2 text-on-surface-variant transition-colors hover:bg-primary-container hover:text-primary"
          aria-label="Edit entry"
        >
          <Pencil size={14} />
        </button>

        <button
          type="button"
          onClick={onCopy}
          disabled={isDecrypting}
          className="rounded-full bg-surface-container-low p-2 text-on-surface-variant transition-colors hover:bg-primary-container hover:text-primary"
          aria-label="Copy password"
        >
          {isCopied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    </article>
  )
}
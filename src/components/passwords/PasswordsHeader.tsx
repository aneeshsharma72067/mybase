import { Lock, Plus, Search } from 'lucide-react'

interface PasswordsHeaderProps {
  searchValue: string
  onSearchValueChange: (value: string) => void
  statusText: string
  onLockVault: () => void
  onAddEntry: () => void
  isUnlocked: boolean
}

export function PasswordsHeader({
  searchValue,
  onSearchValueChange,
  statusText,
  onLockVault,
  onAddEntry,
  isUnlocked,
}: PasswordsHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-black tracking-tight text-primary lg:text-5xl">Passwords</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Your botanical digital keys, kept in perfect safety.</p>
        <p className="mt-3 inline-flex rounded-full bg-surface-container-low px-3 py-1 text-xs font-semibold text-on-surface-variant">
          {statusText}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 rounded-full bg-surface-container-lowest px-3 py-2 text-on-surface-variant shadow-sm">
          <Search size={15} />
          <input
            value={searchValue}
            onChange={(event) => onSearchValueChange(event.target.value)}
            placeholder="Search the sanctuary..."
            className="w-44 bg-transparent text-sm outline-none lg:w-64"
          />
        </label>

        <button
          type="button"
          onClick={onLockVault}
          className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-2 text-xs font-semibold hover:bg-surface-container"
        >
          <Lock size={14} />
          Lock Vault
        </button>

        <button
          type="button"
          onClick={onAddEntry}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-on-primary hover:bg-primary-dim"
          disabled={!isUnlocked}
        >
          <Plus size={14} />
          Add Entry
        </button>
      </div>
    </header>
  )
}
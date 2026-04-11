import { RefreshCw } from 'lucide-react'

interface PasswordGeneratorCardProps {
  generatedPassword: string
  length: number
  includeUpper: boolean
  includeLower: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  onLengthChange: (value: number) => void
  onToggleUpper: () => void
  onToggleLower: () => void
  onToggleNumbers: () => void
  onToggleSymbols: () => void
  onRegenerate: () => void
  onApplyToVault: () => void
  isUnlocked: boolean
}

export function PasswordGeneratorCard({
  generatedPassword,
  length,
  includeUpper,
  includeLower,
  includeNumbers,
  includeSymbols,
  onLengthChange,
  onToggleUpper,
  onToggleLower,
  onToggleNumbers,
  onToggleSymbols,
  onRegenerate,
  onApplyToVault,
  isUnlocked,
}: PasswordGeneratorCardProps) {
  return (
    <section className="relative overflow-hidden rounded-xl bg-primary p-6 text-on-primary">
      <img
        alt="Forest silhouette"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAM-QpCTiwzuVVz7APAtswL2e7e_TGOyTH2GusZkX3TNEDs0t15s5coh_Iqr0ihuHTYA4KcGXe1QBT5yFIBb2A9Jxcu-cPOyUBVSYmf_mlMNgwNGmGxm9xj2Hi3Z8wj8RpFVVf6ABxcc-Xxhqs4UDpYbKinFeHKZ5ELRHn1958ASTyNdgcGJF7pOuWV5lpBsy_wBCEN155eLrLdCQlmzn9Ts9MJ7ZV0lrB9l5-_VcRZDxuOxPJy-TZR7JjlootmQrIPb15gwwiF2-0"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary/80 to-transparent" />
      <div className="relative z-10">
        <h3 className="mb-4 font-display text-xl font-bold">Password Generator</h3>
        <div className="mb-5 flex items-center justify-between rounded-lg bg-primary-dim/50 px-3 py-2 font-mono text-sm">
          <span className="max-w-52 truncate">{generatedPassword}</span>
          <button
            type="button"
            onClick={onRegenerate}
            className="transition-colors hover:text-primary-fixed"
            aria-label="Regenerate password"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>Length</span>
              <span className="font-bold">{length}</span>
            </div>
            <input
              type="range"
              min={8}
              max={32}
              value={length}
              onChange={(event) => onLengthChange(Number(event.target.value))}
              className="w-full accent-on-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={onToggleUpper}
              className={[
                'rounded-full px-3 py-2 transition-colors',
                includeUpper ? 'bg-primary-container text-on-primary-container' : 'bg-primary-dim/50 text-on-primary',
              ].join(' ')}
            >
              ABC
            </button>
            <button
              type="button"
              onClick={onToggleLower}
              className={[
                'rounded-full px-3 py-2 transition-colors',
                includeLower ? 'bg-primary-container text-on-primary-container' : 'bg-primary-dim/50 text-on-primary',
              ].join(' ')}
            >
              abc
            </button>
            <button
              type="button"
              onClick={onToggleNumbers}
              className={[
                'rounded-full px-3 py-2 transition-colors',
                includeNumbers ? 'bg-primary-container text-on-primary-container' : 'bg-primary-dim/50 text-on-primary',
              ].join(' ')}
            >
              123
            </button>
            <button
              type="button"
              onClick={onToggleSymbols}
              className={[
                'rounded-full px-3 py-2 transition-colors',
                includeSymbols ? 'bg-primary-container text-on-primary-container' : 'bg-primary-dim/50 text-on-primary',
              ].join(' ')}
            >
              #$&
            </button>
          </div>

          <button
            type="button"
            onClick={onApplyToVault}
            className="w-full rounded-full bg-on-primary px-4 py-3 font-bold text-primary transition-colors hover:bg-primary-fixed"
            disabled={!isUnlocked}
          >
            Apply to Vault
          </button>
        </div>
      </div>
    </section>
  )
}
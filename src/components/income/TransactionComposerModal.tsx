import { X } from 'lucide-react'
import type { DraftTransaction } from './income.helpers'

interface TransactionComposerModalProps {
  isOpen: boolean
  draft: DraftTransaction
  categories: string[]
  onDraftChange: (field: keyof DraftTransaction, value: string) => void
  onClose: () => void
  onSave: () => void
}

export function TransactionComposerModal({
  isOpen,
  draft,
  categories,
  onDraftChange,
  onClose,
  onSave,
}: TransactionComposerModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-[2.5rem] bg-surface-container-lowest p-6 shadow-2xl md:p-8" onClick={(event) => event.stopPropagation()}>
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-black text-[#1b4332]">Add Transaction</h3>
            <p className="mt-1 text-sm text-on-surface-variant">Log income or expense with clean categorization.</p>
          </div>
          <button type="button" onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-outline hover:bg-surface-container" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onDraftChange('type', 'income')}
              className={[
                'rounded-full px-4 py-2 text-sm font-bold',
                draft.type === 'income' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant',
              ].join(' ')}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => onDraftChange('type', 'expense')}
              className={[
                'rounded-full px-4 py-2 text-sm font-bold',
                draft.type === 'expense' ? 'bg-secondary text-on-primary' : 'bg-surface-container-low text-on-surface-variant',
              ].join(' ')}
            >
              Expense
            </button>
          </div>

          <input
            value={draft.label}
            onChange={(event) => onDraftChange('label', event.target.value)}
            placeholder="Description"
            className="w-full rounded-2xl bg-surface-container-low px-4 py-3 text-sm outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={draft.amount}
              onChange={(event) => onDraftChange('amount', event.target.value)}
              placeholder="Amount"
              type="number"
              min={0}
              className="w-full rounded-2xl bg-surface-container-low px-4 py-3 text-sm outline-none"
            />
            <input
              value={draft.date}
              onChange={(event) => onDraftChange('date', event.target.value)}
              type="date"
              className="w-full rounded-2xl bg-surface-container-low px-4 py-3 text-sm outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              value={draft.category}
              onChange={(event) => onDraftChange('category', event.target.value)}
              placeholder="Category"
              list="income-categories"
              className="w-full rounded-2xl bg-surface-container-low px-4 py-3 text-sm outline-none"
            />
            <input
              value={draft.notes}
              onChange={(event) => onDraftChange('notes', event.target.value)}
              placeholder="Notes"
              className="w-full rounded-2xl bg-surface-container-low px-4 py-3 text-sm outline-none"
            />
            <datalist id="income-categories">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container">
            Cancel
          </button>
          <button type="button" onClick={onSave} className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-on-primary hover:bg-primary-dim">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
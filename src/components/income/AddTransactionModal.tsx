import { X, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { getAllCategories, useIncomeStore } from '../../store/useIncomeStore'
import type { Transaction, TransactionType } from '../../types/income.types'

interface AddTransactionModalProps {
  open: boolean
  onClose: () => void
  prefillType: TransactionType | null
  editingTransaction: Transaction | null
}

function getTodayValue(): string {
  return new Date().toISOString().split('T')[0]
}

export function AddTransactionModal({ open, onClose, prefillType, editingTransaction }: AddTransactionModalProps) {
  const transactions = useIncomeStore((state) => state.transactions)
  const addTransaction = useIncomeStore((state) => state.addTransaction)
  const updateTransaction = useIncomeStore((state) => state.updateTransaction)
  const deleteTransaction = useIncomeStore((state) => state.deleteTransaction)

  const categoryOptions = useMemo(() => getAllCategories(transactions), [transactions])
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [type, setType] = useState<TransactionType>('income')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(getTodayValue())
  const [notes, setNotes] = useState('')
  const [errorText, setErrorText] = useState('')

  useEffect(() => {
    if (open) {
      const nextType = editingTransaction?.type ?? prefillType ?? 'income'

      setType(nextType)
      setDescription(editingTransaction?.description ?? '')
      setAmount(editingTransaction?.amount ? editingTransaction.amount.toString() : '')
      setCategory(editingTransaction?.category ?? '')
      setDate(editingTransaction?.date ?? getTodayValue())
      setNotes(editingTransaction?.notes ?? '')
      setErrorText('')
      setIsMounted(true)

      const frame = window.requestAnimationFrame(() => {
        setIsVisible(true)
      })

      return () => window.cancelAnimationFrame(frame)
    }

    setIsVisible(false)
    const timeoutId = window.setTimeout(() => setIsMounted(false), 220)
    return () => window.clearTimeout(timeoutId)
  }, [editingTransaction, open, prefillType])

  useEffect(() => {
    if (!open) {
      return
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose, open])

  function resetAndClose() {
    onClose()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedDescription = description.trim()
    const normalizedCategory = category.trim()
    const normalizedNotes = notes.trim()
    const parsedAmount = Number(amount)

    if (!normalizedDescription || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setErrorText('Description and amount are required.')
      return
    }

    const payload = {
      type,
      amount: parsedAmount,
      description: normalizedDescription,
      category: normalizedCategory,
      date,
      notes: normalizedNotes || undefined,
    }

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, payload)
    } else {
      addTransaction(payload)
    }

    resetAndClose()
  }

  function handleDelete() {
    if (!editingTransaction) {
      return
    }

    if (!window.confirm('Delete this transaction?')) {
      return
    }

    deleteTransaction(editingTransaction.id)
    resetAndClose()
  }

  if (!isMounted) {
    return null
  }

  return (
    <div
      className={[
        'fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6 backdrop-blur-sm transition-opacity duration-220 ease-out',
        isVisible ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
      onClick={resetAndClose}
    >
      <div
        className={[
          'w-full max-w-lg rounded-[2.5rem] bg-surface-container-lowest p-6 shadow-2xl transition-all duration-220 ease-out md:p-8',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        ].join(' ')}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-black text-[#1b4332]">{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h3>
            <p className="mt-1 text-sm text-on-surface-variant">Log income or expense with clean categorization.</p>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
            aria-label="Close transaction modal"
          >
            <X size={16} />
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block px-1 text-sm font-bold text-primary">Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('income')}
                className={[
                  'rounded-full px-4 py-2 text-sm font-bold transition-colors',
                  type === 'income' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant',
                ].join(' ')}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setType('expense')}
                className={[
                  'rounded-full px-4 py-2 text-sm font-bold transition-colors',
                  type === 'expense' ? 'bg-secondary text-on-primary' : 'bg-surface-container-low text-on-surface-variant',
                ].join(' ')}
              >
                Expense
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block px-1 text-sm font-bold text-primary" htmlFor="income-description">
              Description
            </label>
            <input
              id="income-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Monthly Salary, Freelance Project..."
              className="w-full rounded-2xl bg-surface-container-low px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div>
            <label className="mb-2 block px-1 text-sm font-bold text-primary" htmlFor="income-amount">
              Amount
            </label>
            <div className="flex items-center gap-3 rounded-2xl bg-surface-container-low px-5 py-4 text-sm font-medium focus-within:ring-2 focus-within:ring-primary/20">
              <span className="text-on-surface-variant">₹</span>
              <input
                id="income-amount"
                type="number"
                min={0}
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block px-1 text-sm font-bold text-primary" htmlFor="income-category">
              Category
            </label>
            <input
              id="income-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Primary, Groceries, Freelance..."
              list="income-category-options"
              className="w-full rounded-2xl bg-surface-container-low px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
            />
            <datalist id="income-category-options">
              {categoryOptions.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="mb-2 block px-1 text-sm font-bold text-primary" htmlFor="income-date">
              Date
            </label>
            <input
              id="income-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full rounded-2xl bg-surface-container-low px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div>
            <label className="mb-2 block px-1 text-sm font-bold text-primary" htmlFor="income-notes">
              Notes
            </label>
            <textarea
              id="income-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional note..."
              rows={2}
              className="w-full rounded-2xl bg-surface-container-low px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {errorText ? <p className="text-sm font-medium text-error">{errorText}</p> : null}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={resetAndClose}
              className="rounded-full bg-surface-container-low px-5 py-2.5 text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container"
            >
              Cancel
            </button>
            {editingTransaction ? (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-full bg-error-container/20 px-5 py-2.5 text-sm font-bold text-error transition-colors hover:bg-error-container/30"
              >
                <Trash2 size={14} /> Delete
              </button>
            ) : null}
            <button
              type="submit"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-on-primary transition-colors hover:bg-primary-dim"
            >
              {editingTransaction ? 'Save Changes' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { Transaction } from '../../types/income.types'
import { RecentTransactionsTable } from './RecentTransactionsTable'

interface AllTransactionsModalProps {
  isMounted: boolean
  isVisible: boolean
  transactions: Transaction[]
  onClose: () => void
  onEditTransaction?: (transaction: Transaction) => void
  onDeleteTransaction?: (transaction: Transaction) => void
}

export function AllTransactionsModal({
  isMounted,
  isVisible,
  transactions,
  onClose,
  onEditTransaction,
  onDeleteTransaction,
}: AllTransactionsModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isMounted) {
      closeButtonRef.current?.focus()
    }
  }, [isMounted])

  useEffect(() => {
    if (!isMounted) {
      return
    }

    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
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
  }, [isMounted, onClose])

  if (!isMounted) {
    return null
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={[
        'fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm transition-opacity duration-200',
        isVisible ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className={[
          'h-[86vh] w-full max-w-6xl overflow-hidden rounded-4xl bg-surface-container-lowest shadow-2xl transition-all duration-220',
          isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0',
        ].join(' ')}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-outline-variant/25 px-8 py-5">
          <h3 className="font-display text-2xl font-black text-primary">All Transactions</h3>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
            aria-label="Close all transactions modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="h-[calc(86vh-74px)] overflow-y-auto p-6">
          <RecentTransactionsTable
            transactions={transactions}
            showViewAll={false}
            onEditTransaction={onEditTransaction}
            onDeleteTransaction={onDeleteTransaction}
          />
        </div>
      </div>
    </div>
  )
}

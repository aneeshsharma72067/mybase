import { AlertTriangle, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface ImportConfirmModalProps {
  isOpen: boolean
  fileName: string
  exportedAt: string
  storeCount: number
  onConfirm: () => void
  onClose: () => void
}

export function ImportConfirmModal({
  isOpen,
  fileName,
  exportedAt,
  storeCount,
  onConfirm,
  onClose,
}: ImportConfirmModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      cancelButtonRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
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
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  const exportedLabel = exportedAt ? new Date(exportedAt).toLocaleString() : 'unknown date'

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md rounded-4xl bg-surface-container-lowest p-6 shadow-2xl md:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-error-container/20 text-error">
              <AlertTriangle size={20} />
            </span>
            <h3 className="font-display text-xl font-black text-on-surface">Restore from backup?</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
            aria-label="Close restore dialog"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 text-sm text-on-surface-variant">
          <p>
            This replaces <strong className="text-on-surface">all current data</strong> with the contents of the
            backup. This cannot be undone.
          </p>
          <div className="rounded-2xl bg-surface-container px-4 py-3 text-xs">
            <p className="truncate font-bold text-on-surface">{fileName}</p>
            <p className="mt-1">Exported: {exportedLabel}</p>
            <p>Stores: {storeCount}</p>
          </div>
          <p className="text-xs">The app will reload after restoring.</p>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-xl border border-outline-variant bg-surface px-5 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-error px-5 py-2.5 text-sm font-bold text-on-error transition-transform active:scale-95"
          >
            Replace &amp; Restore
          </button>
        </div>
      </div>
    </div>
  )
}

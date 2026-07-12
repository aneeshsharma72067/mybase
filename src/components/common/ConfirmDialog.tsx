import { useEffect, useRef } from 'react'
import { useConfirmStore } from '../../lib/confirm'

/**
 * Host for the imperative confirm dialog. Mount once near the app root. Renders
 * nothing until confirmAction() is called. Provides role=dialog semantics, a
 * focus trap, Escape-to-cancel, and backdrop-to-cancel.
 */
export function ConfirmDialog() {
  const isOpen = useConfirmStore((state) => state.isOpen)
  const options = useConfirmStore((state) => state.options)
  const settle = useConfirmStore((state) => state.settle)

  const dialogRef = useRef<HTMLDivElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  // Move focus into the dialog when it opens.
  useEffect(() => {
    if (isOpen) {
      confirmButtonRef.current?.focus()
    }
  }, [isOpen])

  // Escape to cancel, Tab to trap focus.
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        settle(false)
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
  }, [isOpen, settle])

  if (!isOpen || !options) {
    return null
  }

  const confirmLabel = options.confirmLabel ?? 'Confirm'
  const cancelLabel = options.cancelLabel ?? 'Cancel'

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm"
      onClick={() => settle(false)}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby={options.message ? 'confirm-dialog-message' : undefined}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border border-outline-variant/50 bg-surface-container-low p-6 shadow-xl"
      >
        <h2
          id="confirm-dialog-title"
          className="font-display text-lg font-black tracking-tight text-on-surface"
        >
          {options.title}
        </h2>
        {options.message ? (
          <p id="confirm-dialog-message" className="mt-2 text-sm text-on-surface-variant">
            {options.message}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => settle(false)}
            className="rounded-2xl px-4 py-2.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={() => settle(true)}
            className={[
              'rounded-2xl px-4 py-2.5 text-sm font-semibold transition hover:opacity-95',
              options.destructive
                ? 'bg-error text-on-error'
                : 'bg-primary text-on-primary',
            ].join(' ')}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

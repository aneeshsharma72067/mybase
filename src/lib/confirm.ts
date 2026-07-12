import { create } from 'zustand'

/**
 * Imperative, promise-based confirm dialog — a branded, accessible replacement
 * for window.confirm(). Call confirmAction() from anywhere (event handlers,
 * async flows) and await the boolean result. A single <ConfirmDialog /> host,
 * mounted once near the app root, renders whatever request is active.
 */

export interface ConfirmOptions {
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  /** Styles the confirm button as destructive (red) when true. */
  destructive?: boolean
}

interface ConfirmState {
  isOpen: boolean
  options: ConfirmOptions | null
  resolve: ((confirmed: boolean) => void) | null
  open: (options: ConfirmOptions) => Promise<boolean>
  settle: (confirmed: boolean) => void
}

const useConfirmStore = create<ConfirmState>((set, get) => ({
  isOpen: false,
  options: null,
  resolve: null,
  open: (options) =>
    new Promise<boolean>((resolve) => {
      // If a dialog is somehow already open, resolve it as cancelled first so
      // its awaiter never hangs.
      const previous = get().resolve
      if (previous) {
        previous(false)
      }

      set({ isOpen: true, options, resolve })
    }),
  settle: (confirmed) => {
    const { resolve } = get()
    if (resolve) {
      resolve(confirmed)
    }
    set({ isOpen: false, resolve: null })
  },
}))

/** Await a user confirmation. Resolves true if confirmed, false if cancelled. */
export function confirmAction(options: ConfirmOptions): Promise<boolean> {
  return useConfirmStore.getState().open(options)
}

export { useConfirmStore }

import { useEffect, useRef } from 'react'
import { usePasswordStore } from '../store/usePasswordStore'
import { useSettingsStore } from '../store/useSettingsStore'

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'] as const

/**
 * Locks the password vault after the configured idle period.
 * No-op when the vault is not unlocked or auto-lock is set to "Never" (0).
 */
export function useAutoLock(): void {
  const autoLockMinutes = useSettingsStore((state) => state.settings.autoLockMinutes)
  const vaultState = usePasswordStore((state) => state.vaultState)
  const lockVault = usePasswordStore((state) => state.lockVault)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (autoLockMinutes <= 0 || vaultState !== 'unlocked') {
      return
    }

    const idleMs = autoLockMinutes * 60 * 1000

    function resetTimer() {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        lockVault()
      }, idleMs)
    }

    resetTimer()

    for (const eventName of ACTIVITY_EVENTS) {
      window.addEventListener(eventName, resetTimer, { passive: true })
    }

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }

      for (const eventName of ACTIVITY_EVENTS) {
        window.removeEventListener(eventName, resetTimer)
      }
    }
  }, [autoLockMinutes, vaultState, lockVault])
}

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { setDataEncryptionEnabled } from '../../lib/encryptedStorage'
import { applyAccent, applyBorderStyle, applyTheme } from '../../lib/settingsAppearance'
import { useAutoLock } from '../../lib/useAutoLock'
import { useAppStore } from '../../store/useAppStore'
import { usePasswordStore } from '../../store/usePasswordStore'
import { useSettingsStore } from '../../store/useSettingsStore'
import { ConfirmDialog } from '../common/ConfirmDialog'
import { DailyCheckInModal } from '../health/DailyCheckInModal'
import { OnboardingModal } from '../onboarding/OnboardingModal'
import { AppLockScreen } from './AppLockScreen'
import { MainArea } from './MainArea'
import { Sidebar } from './Sidebar'

const moduleByPath: Record<string, string> = {
  '/': 'dashboard',
  '/dashboard': 'dashboard',
  '/health': 'health',
  '/thoughts': 'thoughts',
  '/goals': 'goals',
  '/todos': 'todos',
  '/bookmarks': 'bookmarks',
  '/passwords': 'passwords',
  '/income': 'income',
  '/settings': 'settings',
}

export function Shell() {
  const location = useLocation()
  const setActiveModule = useAppStore((state) => state.setActiveModule)
  const settings = useSettingsStore((state) => state.settings)
  const patchSettings = useSettingsStore((state) => state.patchSettings)
  const vaultState = usePasswordStore((state) => state.vaultState)
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)

  useAutoLock()

  const isAppLocked = settings.encryptData && vaultState !== 'unlocked'

  useEffect(() => {
    setActiveModule(moduleByPath[location.pathname] ?? 'dashboard')
  }, [location.pathname, setActiveModule])

  useEffect(() => {
    applyTheme(settings.themeMode)
    applyAccent(settings.accent)
    applyBorderStyle(settings.borderStyle)
  }, [settings.accent, settings.borderStyle, settings.themeMode])

  useEffect(() => {
    setDataEncryptionEnabled(settings.encryptData)
  }, [settings.encryptData])

  if (isAppLocked) {
    return <AppLockScreen />
  }

  return (
    <div className="min-h-screen bg-background text-on-background lg:grid lg:grid-cols-[18rem_1fr]">
      <Sidebar
        onOpenCheckIn={() => setShowCheckIn(true)}
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
      />
      <MainArea onOpenNav={() => setIsNavOpen(true)} />
      <ConfirmDialog />
      <DailyCheckInModal isOpen={showCheckIn} onClose={() => setShowCheckIn(false)} />
      {!settings.onboarded ? (
        <OnboardingModal
          onComplete={(profile) => patchSettings({ ...profile, onboarded: true })}
        />
      ) : null}
    </div>
  )
}
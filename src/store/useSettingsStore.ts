import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { createZustandStorage } from '../lib/storage'
import type { SettingsStoreState, UserSettings } from '../types/settings.types'

type SettingsStoreActions = {
  setSettings: (settings: UserSettings) => void
  patchSettings: (patch: Partial<UserSettings>) => void
}

export type SettingsStore = SettingsStoreState & SettingsStoreActions

const initialSettings: UserSettings = {
  displayName: 'Julian Forest',
  email: 'julian@mybase.com',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuADLry5E3tZBNKEDM6EvOBz1VSy4wkcUel1QoGoKwdsMa2_WASge_BxdRVkOWy_mL-iAuFNdEdB4fnGDsIRWJHB4iYmG-zXhvi6OSzHG5SHvcludX8SNcgaSQqoMbZcaKBvgJhrUCHSwvowEhwv3AKQu0rd9ThPghThAe9cLruKh_7n3kIHmdeWexICgnyhREzIU0_6QO8DcCmQ2bb2_LHRA5ejq-yAtemxijKCnQvG8Q2qRXJjFkTRWuPHnAqIvACjYtIZQjonSDQ',
  themeMode: 'light',
  accent: 'primary',
  borderStyle: 'smooth',
  notificationsEnabled: true,
  defaultLandingPage: 'dashboard',
  autoLockMinutes: 15,
}

const initialState: SettingsStoreState = {
  settings: initialSettings,
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    immer((set) => ({
      ...initialState,
      setSettings: (settings) => {
        set((state) => {
          state.settings = settings
        })
      },
      patchSettings: (patch) => {
        set((state) => {
          Object.assign(state.settings, patch)
        })
      },
    })),
    {
      name: 'mybase-settings',
      storage: createZustandStorage(),
      partialize: (state) => ({ settings: state.settings }),
    },
  ),
)

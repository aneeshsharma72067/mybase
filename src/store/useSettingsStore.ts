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
  displayName: '',
  email: '',
  avatarUrl: '',
  themeMode: 'light',
  accent: 'primary',
  borderStyle: 'smooth',
  notificationsEnabled: true,
  defaultLandingPage: 'dashboard',
  autoLockMinutes: 15,
  onboarded: false,
  encryptData: false,
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

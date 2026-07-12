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
      version: 1,
      storage: createZustandStorage(),
      partialize: (state) => ({ settings: state.settings }),
      // Merge persisted settings over defaults so fields added in newer
      // versions (e.g. encryptData) fall back instead of coming through as
      // undefined. A corrupt payload resets to defaults.
      migrate: (persistedState: unknown) => {
        const next = persistedState as { settings?: Partial<UserSettings> } | undefined
        return { settings: { ...initialSettings, ...(next?.settings ?? {}) } }
      },
    },
  ),
)

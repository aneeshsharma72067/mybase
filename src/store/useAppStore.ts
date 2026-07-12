import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { createMergeMigrate, createZustandStorage } from '../lib/storage'
import type { AppStoreState } from '../types/app.types'

type AppStoreActions = {
  setSidebarOpen: (open: boolean) => void
  setActiveModule: (module: string) => void
  toggleTheme: () => void
}

export type AppStore = AppStoreState & AppStoreActions

const initialState: AppStoreState = {
  sidebarOpen: true,
  activeModule: 'dashboard',
  theme: 'light',
}

export const useAppStore = create<AppStore>()(
  persist(
    immer((set) => ({
      ...initialState,
      setSidebarOpen: (open) => {
        set((state) => {
          state.sidebarOpen = open
        })
      },
      setActiveModule: (module) => {
        set((state) => {
          state.activeModule = module
        })
      },
      toggleTheme: () => {
        set((state) => {
          state.theme = state.theme === 'light' ? 'dark' : 'light'
        })
      },
    })),
    {
      name: 'mybase-app',
      version: 1,
      storage: createZustandStorage(),
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        activeModule: state.activeModule,
        theme: state.theme,
      }),
      migrate: createMergeMigrate({
        sidebarOpen: initialState.sidebarOpen,
        activeModule: initialState.activeModule,
        theme: initialState.theme,
      }),
    },
  ),
)
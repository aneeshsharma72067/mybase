import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { applyAccent, applyBorderStyle, applyTheme } from '../../lib/settingsAppearance'
import { useAppStore } from '../../store/useAppStore'
import { useSettingsStore } from '../../store/useSettingsStore'
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

  useEffect(() => {
    setActiveModule(moduleByPath[location.pathname] ?? 'dashboard')
  }, [location.pathname, setActiveModule])

  useEffect(() => {
    applyTheme(settings.themeMode)
    applyAccent(settings.accent)
    applyBorderStyle(settings.borderStyle)
  }, [settings.accent, settings.borderStyle, settings.themeMode])

  return (
    <div className="min-h-screen bg-background text-on-background lg:grid lg:grid-cols-[18rem_1fr]">
      <Sidebar />
      <MainArea />
    </div>
  )
}
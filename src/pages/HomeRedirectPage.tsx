import { Navigate } from 'react-router-dom'
import { useSettingsStore } from '../store/useSettingsStore'
import type { SettingsLandingPage } from '../types/settings.types'

const pathByLandingPage: Record<SettingsLandingPage, string> = {
  dashboard: '/dashboard',
  thoughts: '/thoughts',
  goals: '/goals',
  todos: '/todos',
  bookmarks: '/bookmarks',
  passwords: '/passwords',
  income: '/income',
  settings: '/settings',
}

export function HomeRedirectPage() {
  const defaultLandingPage = useSettingsStore((state) => state.settings.defaultLandingPage)

  return <Navigate to={pathByLandingPage[defaultLandingPage] ?? '/dashboard'} replace />
}

export default HomeRedirectPage

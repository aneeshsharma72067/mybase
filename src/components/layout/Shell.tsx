import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { MainArea } from './MainArea'
import { Sidebar } from './Sidebar'

const moduleByPath: Record<string, string> = {
  '/': 'dashboard',
  '/thoughts': 'thoughts',
  '/goals': 'goals',
  '/todos': 'todos',
  '/bookmarks': 'bookmarks',
  '/passwords': 'passwords',
  '/income': 'income',
}

export function Shell() {
  const location = useLocation()
  const setActiveModule = useAppStore((state) => state.setActiveModule)

  useEffect(() => {
    setActiveModule(moduleByPath[location.pathname] ?? 'dashboard')
  }, [location.pathname, setActiveModule])

  return (
    <div className="min-h-screen bg-background text-on-background lg:grid lg:grid-cols-[18rem_1fr]">
      <Sidebar />
      <MainArea />
    </div>
  )
}
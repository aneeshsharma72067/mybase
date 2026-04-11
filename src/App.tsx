import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Shell } from './components/layout/Shell'
import { BookmarksPage } from './pages/BookmarksPage'
import { DashboardPage } from './pages/DashboardPage'
import { GoalsPage } from './pages/GoalsPage'
import { HomeRedirectPage } from './pages/HomeRedirectPage'
import { IncomePage } from './pages/IncomePage'
import { PasswordsPage } from './pages/PasswordsPage'
import { SettingsPage } from './pages/SettingsPage'
import { ThoughtsPage } from './pages/ThoughtsPage'
import { TodoPage } from './pages/TodoPage'

const router = createBrowserRouter([
  {
    element: <Shell />,
    children: [
      { index: true, element: <HomeRedirectPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'thoughts', element: <ThoughtsPage /> },
      { path: 'goals', element: <GoalsPage /> },
      { path: 'todos', element: <TodoPage /> },
      { path: 'bookmarks', element: <BookmarksPage /> },
      { path: 'passwords', element: <PasswordsPage /> },
      { path: 'income', element: <IncomePage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}

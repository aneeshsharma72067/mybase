import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Shell } from './components/layout/Shell'
import { BookmarksPage } from './pages/BookmarksPage'
import { DashboardPage } from './pages/DashboardPage'
import { GoalsPage } from './pages/GoalsPage'
import { IncomePage } from './pages/IncomePage'
import { PasswordsPage } from './pages/PasswordsPage'
import { ThoughtsPage } from './pages/ThoughtsPage'
import { TodoPage } from './pages/TodoPage'

const router = createBrowserRouter([
  {
    element: <Shell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'thoughts', element: <ThoughtsPage /> },
      { path: 'goals', element: <GoalsPage /> },
      { path: 'todos', element: <TodoPage /> },
      { path: 'bookmarks', element: <BookmarksPage /> },
      { path: 'passwords', element: <PasswordsPage /> },
      { path: 'income', element: <IncomePage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}

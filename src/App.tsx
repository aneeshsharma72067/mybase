import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from './components/layout/ErrorBoundary'
import { PageFallback } from './components/layout/PageFallback'
import { Shell } from './components/layout/Shell'
import { HomeRedirectPage } from './pages/HomeRedirectPage'

// Route-level code splitting: each page becomes its own chunk, loaded on
// navigation instead of in the initial bundle. Pages are named exports, so map
// them onto the default export React.lazy expects. HomeRedirectPage stays eager
// — it only redirects, so lazy-loading it would add a needless Suspense flash
// on first paint.
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const HealthPage = lazy(() => import('./pages/HealthPage').then((m) => ({ default: m.HealthPage })))
const ThoughtsPage = lazy(() =>
  import('./pages/ThoughtsPage').then((m) => ({ default: m.ThoughtsPage })),
)
const GoalsPage = lazy(() => import('./pages/GoalsPage').then((m) => ({ default: m.GoalsPage })))
const TodoPage = lazy(() => import('./pages/TodoPage').then((m) => ({ default: m.TodoPage })))
const BookmarksPage = lazy(() =>
  import('./pages/BookmarksPage').then((m) => ({ default: m.BookmarksPage })),
)
const PasswordsPage = lazy(() =>
  import('./pages/PasswordsPage').then((m) => ({ default: m.PasswordsPage })),
)
const IncomePage = lazy(() => import('./pages/IncomePage').then((m) => ({ default: m.IncomePage })))
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)

function lazyRoute(element: React.ReactNode) {
  return <Suspense fallback={<PageFallback />}>{element}</Suspense>
}

const router = createBrowserRouter([
  {
    element: <Shell />,
    children: [
      { index: true, element: <HomeRedirectPage /> },
      { path: 'dashboard', element: lazyRoute(<DashboardPage />) },
      { path: 'health', element: lazyRoute(<HealthPage />) },
      { path: 'thoughts', element: lazyRoute(<ThoughtsPage />) },
      { path: 'goals', element: lazyRoute(<GoalsPage />) },
      { path: 'todos', element: lazyRoute(<TodoPage />) },
      { path: 'bookmarks', element: lazyRoute(<BookmarksPage />) },
      { path: 'passwords', element: lazyRoute(<PasswordsPage />) },
      { path: 'income', element: lazyRoute(<IncomePage />) },
      { path: 'settings', element: lazyRoute(<SettingsPage />) },
    ],
  },
], {
  basename: '/mybase',
})

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}

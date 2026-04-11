import { Outlet } from 'react-router-dom'

export function MainArea() {
  return (
    <main className="min-h-screen p-4 lg:p-10">
      <Outlet />
    </main>
  )
}
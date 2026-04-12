import { BookMarked, HeartPulse, Leaf, Lock, Timer, Zap } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import { GoalsProgressCard } from '../components/dashboard/GoalsProgressCard'
import { IncomeSummaryCard } from '../components/dashboard/IncomeSummaryCard'
import { QuickStatsGrid } from '../components/dashboard/QuickStatsGrid'
import { TeaserCard } from '../components/dashboard/TeaserCard'
import { ThoughtDumpCard } from '../components/dashboard/ThoughtDumpCard'
import { TodosCard } from '../components/dashboard/TodosCard'
import { generateId } from '../lib/utils'
import { useSettingsStore } from '../store/useSettingsStore'

const todoItems = [
  { id: '1', label: 'Design system review', done: false },
  { id: '2', label: 'Morning meditation', done: true },
  { id: '3', label: 'Update income summary', done: false },
  { id: '4', label: 'Call the garden center', done: false },
]

const quickStats = [
  { label: 'Focus', value: '4.2h', tone: 'secondary' as const },
  { label: 'Flow States', value: '12', tone: 'primary' as const },
  { label: 'Health', value: '89%', tone: 'tertiary' as const },
  { label: 'Energy', value: 'Active', tone: 'error' as const },
]

const goalProgress = [
  { name: 'Financial Freedom', progress: 65 },
  { name: 'Health and Vitality', progress: 42 },
  { name: 'Digital Detox', progress: 90 },
]

export function DashboardPage() {
  const navigate = useNavigate()
  const displayName = useSettingsStore((state) => state.settings.displayName)
  const [actionMessage, setActionMessage] = useState('Dashboard ready')
  const [dashboardTodos, setDashboardTodos] = useState(todoItems)

  function updateMessage(message: string) {
    setActionMessage(message)
  }

  function handleToggleTodo(id: string) {
    setDashboardTodos((current) =>
      current.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
    )
    updateMessage('Todo status updated')
  }

  function handleAddTodo(label: string) {
    setDashboardTodos((current) => [...current, { id: generateId(), label, done: false }])
    updateMessage('New todo added')
  }

  return (
    <div className="mx-auto w-full max-w-400">
      <DashboardHeader
        displayName={displayName}
        statusMessage={actionMessage}
        onOpenSettings={() => updateMessage('Settings panel requested')}
        onOpenArchive={() => updateMessage('Archive opened')}
        onOpenNotifications={() => updateMessage('Notifications checked')}
      />

      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <div className="col-span-12 space-y-6 lg:col-span-8 lg:space-y-8">
          <ThoughtDumpCard
            title="Thought Dump"
            body="The forest is not just a collection of trees; it is a living system of connection. Applying this to the new project architecture reveals where calm and structure can coexist."
            onExpand={() => updateMessage('Reflection expanded')}
            onQuickNote={() => navigate('/thoughts')}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <IncomeSummaryCard amount="$12,450" growth="+12%" targetProgress={80} />
            <QuickStatsGrid
              stats={quickStats.map((stat) => {
                if (stat.label === 'Focus') {
                  return { ...stat, icon: Timer }
                }

                if (stat.label === 'Flow States') {
                  return { ...stat, icon: Leaf }
                }

                if (stat.label === 'Health') {
                  return { ...stat, icon: HeartPulse }
                }

                return { ...stat, icon: Zap }
              })}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <TeaserCard
              title="Bookmarks"
              subtitle="24 new links saved this week"
              icon={BookMarked}
              onClick={() => navigate('/bookmarks')}
            />
            <TeaserCard
              title="Password Vault"
              subtitle="Security health: Excellent"
              icon={Lock}
              onClick={() => navigate('/passwords')}
            />
          </div>
        </div>

        <div className="col-span-12 space-y-6 lg:col-span-4 lg:space-y-8">
          <TodosCard
            items={dashboardTodos}
            onToggleTodo={handleToggleTodo}
            onAddTodo={handleAddTodo}
            onViewAll={() => navigate('/todos')}
          />

          <GoalsProgressCard
            goals={goalProgress}
            imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCLZngMAvvglKJVpUPhKp3M5K3iajPyl0PNRXzt1z9i0U08npLRlQO4d-BUuwaqZp_-b2e-maddJYsRix9VXfSlvR1AjsFxHBar-0CaQTGopvY6keJmXKR6x_69SETG5HQoJFMCHz9J_Pyxy8U4SyHGDJ8gSe6yC9Vv1tJSGqy8y3AqLtk75wUATcDs6q3h2uIkG0zEMx9kxgTqDXTigkbkx39AyCZvLUuIXE4tQD07bOB6b1tR5unVSzxcXzG5vzDtzJdOS9vGqzM"
            onManageGoals={() => navigate('/goals')}
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
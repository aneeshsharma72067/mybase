import { BookMarked, HeartPulse, Leaf, Lock, Timer, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import { GoalsProgressCard } from '../components/dashboard/GoalsProgressCard'
import { IncomeSummaryCard } from '../components/dashboard/IncomeSummaryCard'
import { QuickStatsGrid } from '../components/dashboard/QuickStatsGrid'
import { TeaserCard } from '../components/dashboard/TeaserCard'
import { ThoughtDumpCard } from '../components/dashboard/ThoughtDumpCard'
import { TodosCard } from '../components/dashboard/TodosCard'
import { getActiveGoals, getGoalProgress, useGoalsStore } from '../store/useGoalsStore'
import { formatCurrency, getNetSavings, getSavingsRate, getTotalIncome, useIncomeStore } from '../store/useIncomeStore'
import { getSecurityHealth, usePasswordStore } from '../store/usePasswordStore'
import { useSettingsStore } from '../store/useSettingsStore'
import { getPendingTodos, getTodaysTodos, useTodoStore } from '../store/useTodoStore'
import { useThoughtsStore } from '../store/useThoughtsStore'
import { useBookmarksStore } from '../store/useBookmarksStore'
import { getTodayISO } from '../lib/utils'

export function DashboardPage() {
  const navigate = useNavigate()
  const displayName = useSettingsStore((state) => state.settings.displayName)
  const incomeTransactions = useIncomeStore((state) => state.transactions)
  const goals = useGoalsStore((state) => state.goals)
  const todos = useTodoStore((state) => state.todos)
  const addTodo = useTodoStore((state) => state.addTodo)
  const toggleTodo = useTodoStore((state) => state.toggleTodo)
  const thoughts = useThoughtsStore((state) => state.thoughts)
  const bookmarkCount = useBookmarksStore((state) => state.bookmarks.length)
  const passwordEntries = usePasswordStore((state) => state.entries)
  const [actionMessage, setActionMessage] = useState('Dashboard ready')

  const activeGoals = useMemo(() => getActiveGoals(goals), [goals])
  const todaysTodos = useMemo(() => getTodaysTodos(todos), [todos])
  const pendingTodos = useMemo(() => getPendingTodos(todos), [todos])
  const health = useMemo(() => getSecurityHealth(passwordEntries), [passwordEntries])
  const totalIncome = useMemo(() => getTotalIncome(incomeTransactions), [incomeTransactions])
  const netSavings = useMemo(() => getNetSavings(incomeTransactions), [incomeTransactions])
  const savingsRate = useMemo(() => getSavingsRate(incomeTransactions), [incomeTransactions])

  const dashboardTodos = useMemo(
    () => (todaysTodos.length > 0 ? todaysTodos : pendingTodos).slice(0, 4).map((todo) => ({ id: todo.id, label: todo.title, done: todo.done })),
    [pendingTodos, todaysTodos],
  )

  const quickStats = useMemo(
    () => [
      { label: 'Focus', value: `${pendingTodos.length}`, tone: 'secondary' as const, icon: Timer },
      { label: 'Flow States', value: `${thoughts.length}`, tone: 'primary' as const, icon: Leaf },
      { label: 'Health', value: `${health.percentage}%`, tone: 'tertiary' as const, icon: HeartPulse },
      { label: 'Energy', value: activeGoals.length > 0 ? 'Active' : 'Idle', tone: 'error' as const, icon: Zap },
    ],
    [activeGoals.length, health.percentage, pendingTodos.length, thoughts.length],
  )

  const goalProgress = useMemo(
    () => activeGoals.slice(0, 3).map((goal) => ({ name: goal.title, progress: getGoalProgress(goal) })),
    [activeGoals],
  )

  const latestThought = useMemo(() => thoughts[0], [thoughts])

  function updateMessage(message: string) {
    setActionMessage(message)
  }

  function handleToggleTodo(id: string) {
    toggleTodo(id)
    updateMessage('Todo status updated')
  }

  function handleAddTodo(label: string) {
    addTodo({
      title: label,
      done: false,
      priority: 'med',
      dueDate: getTodayISO(),
    })
    updateMessage('New todo added')
  }

  return (
    <div className="mx-auto w-full max-w-400">
      <DashboardHeader
        displayName={displayName}
        statusMessage={actionMessage}
        onOpenSettings={() => navigate('/settings')}
      />

      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <div className="col-span-12 space-y-6 lg:col-span-8 lg:space-y-8">
          <ThoughtDumpCard
            title={latestThought?.title?.trim() || latestThought?.quoteText?.trim() || 'Thought Dump'}
            body={latestThought?.body?.trim() || latestThought?.quoteText?.trim() || 'Capture your next reflection from the Thoughts module.'}
            onExpand={() => updateMessage('Reflection expanded')}
            onQuickNote={() => navigate('/thoughts')}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <IncomeSummaryCard
              amount={formatCurrency(totalIncome)}
              growth={`${netSavings >= 0 ? '+' : ''}${savingsRate}%`}
              targetProgress={Math.max(0, Math.min(100, savingsRate))}
            />
            <QuickStatsGrid stats={quickStats} />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <TeaserCard
              title="Bookmarks"
              subtitle={`${bookmarkCount} saved links`}
              icon={BookMarked}
              onClick={() => navigate('/bookmarks')}
            />
            <TeaserCard
              title="Password Vault"
              subtitle={`Security health: ${health.status}`}
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
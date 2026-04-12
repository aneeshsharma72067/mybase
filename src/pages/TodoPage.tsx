import { useEffect, useMemo, useState } from 'react'
import { TodoFiltersBar, type TodoFilter } from '../components/todos/TodoFiltersBar'
import { TodoHeader } from '../components/todos/TodoHeader'
import { TodoInsightCard } from '../components/todos/TodoInsightCard'
import { TodoListManager } from '../components/todos/TodoListManager'
import { TodoMomentumCard } from '../components/todos/TodoMomentumCard'
import { TodoQuickAdd } from '../components/todos/TodoQuickAdd'
import { TodoTaskItem } from '../components/todos/TodoTaskItem'
import {
  getCompletedTodos,
  getFilteredTodos,
  getTodoMomentumData,
  getPendingTodos,
  getTodaysTodos,
  useTodoStore,
} from '../store/useTodoStore'
import { useThoughtsStore } from '../store/useThoughtsStore'

export function TodoPage() {
  const todos = useTodoStore((state) => state.todos)
  const lists = useTodoStore((state) => state.lists)
  const addTodo = useTodoStore((state) => state.addTodo)
  const updateTodo = useTodoStore((state) => state.updateTodo)
  const deleteTodo = useTodoStore((state) => state.deleteTodo)
  const toggleTodo = useTodoStore((state) => state.toggleTodo)
  const reorderTodos = useTodoStore((state) => state.reorderTodos)
  const addList = useTodoStore((state) => state.addList)
  const deleteList = useTodoStore((state) => state.deleteList)

  const [searchValue, setSearchValue] = useState('')
  const [statusText, setStatusText] = useState('Todo flow ready')
  const [toastText, setToastText] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<TodoFilter>('all')
  const [activeListId, setActiveListId] = useState('all')
  const [archiveOnly, setArchiveOnly] = useState(false)
  const thoughts = useThoughtsStore((state) => state.thoughts)

  function pushStatus(message: string) {
    setStatusText(message)
    setToastText(message)
  }

  useEffect(() => {
    if (!toastText) {
      return
    }

    const timeout = window.setTimeout(() => {
      setToastText(null)
    }, 2200)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [toastText])

  const counts = useMemo(
    () => ({
      all: todos.length,
      pending: getPendingTodos(todos).length,
      completed: getCompletedTodos(todos).length,
      today: getTodaysTodos(todos).length,
    }),
    [todos],
  )

  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, activeFilter, activeListId, searchValue, archiveOnly)
  }, [activeFilter, activeListId, archiveOnly, searchValue, todos])

  const listNameById = useMemo(() => {
    return new Map(lists.map((list) => [list.id, list.name] as const))
  }, [lists])

  const momentumData = useMemo(() => getTodoMomentumData(todos), [todos])

  const pinnedQuote = useMemo(() => {
    const quote = thoughts.find((thought) => thought.type === 'quote' && thought.isPinned && thought.quoteText)

    if (!quote?.quoteText) {
      return {
        text: 'Small completed tasks create enough cognitive calm to protect your most meaningful work blocks.',
        attribution: 'MyBase Insight',
      }
    }

    return {
      text: quote.quoteText,
      attribution: quote.attribution || 'Pinned Quote',
    }
  }, [thoughts])

  function moveTodo(todoId: string, direction: -1 | 1) {
    const currentIndex = todos.findIndex((todo) => todo.id === todoId)

    if (currentIndex < 0) {
      return
    }

    const targetIndex = currentIndex + direction

    if (targetIndex < 0 || targetIndex >= todos.length) {
      return
    }

    const ids = todos.map((todo) => todo.id)
    const [moved] = ids.splice(currentIndex, 1)
    ids.splice(targetIndex, 0, moved)
    reorderTodos(ids)
  }

  return (
    <div className="mx-auto w-full max-w-400">
      <TodoHeader
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onOpenSettings={() => pushStatus('Settings opened')}
        onOpenArchive={() => {
          const next = !archiveOnly
          setArchiveOnly(next)
          pushStatus(next ? 'Archive mode enabled' : 'Archive mode disabled')
        }}
        onOpenNotifications={() => pushStatus('Notifications checked')}
        onOpenCreate={() => pushStatus('Quick create ready below')}
        statusText={statusText}
        archiveActive={archiveOnly}
      />

      <section className="grid grid-cols-12 gap-6 lg:gap-8">
        <div className="col-span-12 space-y-5 lg:col-span-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-black tracking-tight text-primary lg:text-4xl">Daily Focus</h2>
              <p className="text-sm font-medium text-outline">{counts.pending} tasks remaining</p>
            </div>
            <TodoFiltersBar
              activeFilter={activeFilter}
              onFilterChange={(filter) => {
                setActiveFilter(filter)
                pushStatus(`Filter changed to ${filter}`)
              }}
              counts={counts}
            />
          </div>

          <TodoListManager
            lists={lists}
            activeListId={activeListId}
            onActiveListChange={setActiveListId}
            onAddList={(name, color) => {
              addList({ name, color })
              pushStatus(`Created list ${name}`)
            }}
            onDeleteList={(id) => {
              const name = listNameById.get(id) ?? 'list'
              deleteList(id)
              setActiveListId('all')
              pushStatus(`Deleted ${name}`)
            }}
          />

          <div className="space-y-4">
            {visibleTodos.map((todo) => (
              <TodoTaskItem
                key={todo.id}
                todo={todo}
                listName={todo.listId ? listNameById.get(todo.listId) : undefined}
                onToggle={() => {
                  toggleTodo(todo.id)
                  pushStatus(todo.done ? 'Task marked pending' : 'Task completed')
                }}
                onDelete={() => {
                  deleteTodo(todo.id)
                  pushStatus('Task deleted')
                }}
                onMoveUp={() => moveTodo(todo.id, -1)}
                onMoveDown={() => moveTodo(todo.id, 1)}
                onUpdate={(patch) => {
                  updateTodo(todo.id, patch)
                  pushStatus('Task updated')
                }}
              />
            ))}

            {visibleTodos.length === 0 ? (
              <div className="rounded-xl bg-surface-container-low p-8 text-center text-on-surface-variant">
                No tasks match this filter.
              </div>
            ) : null}
          </div>

          <TodoQuickAdd
            lists={lists}
            activeListId={activeListId}
            onCreate={(input) => {
              addTodo(input)
              pushStatus('Task added')
            }}
          />
        </div>

        <div className="col-span-12 space-y-5 lg:col-span-4">
          <TodoMomentumCard
            days={momentumData.days}
            completionRate={momentumData.completionRate}
            completedThisWeek={momentumData.completedThisWeek}
          />

          <TodoInsightCard quoteText={pinnedQuote.text} attribution={pinnedQuote.attribution} />
        </div>
      </section>

      {toastText ? (
        <div className="pointer-events-none fixed bottom-6 right-6 z-40 rounded-full bg-surface-container-high px-4 py-2 text-sm font-semibold text-on-surface shadow-lg">
          {toastText}
        </div>
      ) : null}
    </div>
  )
}

export default TodoPage
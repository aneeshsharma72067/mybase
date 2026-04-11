import { useMemo, useState } from 'react'
import { TodoFiltersBar, type TodoFilter } from '../components/todos/TodoFiltersBar'
import { TodoHeader } from '../components/todos/TodoHeader'
import { TodoInsightCard } from '../components/todos/TodoInsightCard'
import { TodoListManager } from '../components/todos/TodoListManager'
import { TodoMomentumCard } from '../components/todos/TodoMomentumCard'
import { TodoQuickAdd } from '../components/todos/TodoQuickAdd'
import { TodoTaskItem } from '../components/todos/TodoTaskItem'
import {
  getCompletedTodos,
  getPendingTodos,
  getTodaysTodos,
  useTodoStore,
} from '../store/useTodoStore'

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
  const [activeFilter, setActiveFilter] = useState<TodoFilter>('all')
  const [activeListId, setActiveListId] = useState('all')

  const counts = useMemo(
    () => ({
      all: todos.length,
      pending: getPendingTodos().length,
      completed: getCompletedTodos().length,
      today: getTodaysTodos().length,
    }),
    [todos],
  )

  const visibleTodos = useMemo(() => {
    const lowered = searchValue.trim().toLowerCase()

    const byFilter =
      activeFilter === 'pending'
        ? todos.filter((todo) => !todo.done)
        : activeFilter === 'completed'
        ? todos.filter((todo) => todo.done)
        : activeFilter === 'today'
        ? getTodaysTodos()
        : todos

    const byList =
      activeListId === 'all' ? byFilter : byFilter.filter((todo) => todo.listId === activeListId)

    if (!lowered) {
      return byList
    }

    return byList.filter((todo) => {
      const titleMatch = todo.title.toLowerCase().includes(lowered)
      const noteMatch = (todo.note ?? '').toLowerCase().includes(lowered)
      return titleMatch || noteMatch
    })
  }, [activeFilter, activeListId, searchValue, todos])

  const listNameById = useMemo(() => {
    return new Map(lists.map((list) => [list.id, list.name] as const))
  }, [lists])

  const momentumBars = useMemo(() => {
    const total = Math.max(todos.length, 1)
    const completed = todos.filter((todo) => todo.done).length
    const pending = todos.length - completed
    const ratio = Math.round((completed / total) * 100)
    return [Math.max(20, ratio - 35), Math.max(30, ratio - 20), Math.max(25, ratio - 10), ratio, Math.min(100, ratio + 10), Math.max(20, pending * 8), Math.max(25, total * 7)]
  }, [todos])

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
        onOpenSettings={() => setStatusText('Settings opened')}
        onOpenArchive={() => setStatusText('Archive viewed')}
        onOpenNotifications={() => setStatusText('Notifications checked')}
        onOpenCreate={() => setStatusText('Quick create ready below')}
        statusText={statusText}
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
                setStatusText(`Filter changed to ${filter}`)
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
              setStatusText(`Created list ${name}`)
            }}
            onDeleteList={(id) => {
              const name = listNameById.get(id) ?? 'list'
              deleteList(id)
              setActiveListId('all')
              setStatusText(`Deleted ${name}`)
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
                  setStatusText(todo.done ? 'Task marked pending' : 'Task completed')
                }}
                onDelete={() => {
                  deleteTodo(todo.id)
                  setStatusText('Task deleted')
                }}
                onMoveUp={() => moveTodo(todo.id, -1)}
                onMoveDown={() => moveTodo(todo.id, 1)}
                onUpdate={(patch) => {
                  updateTodo(todo.id, patch)
                  setStatusText('Task updated')
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
              setStatusText('Task added')
            }}
          />
        </div>

        <div className="col-span-12 space-y-5 lg:col-span-4">
          <TodoMomentumCard
            bars={momentumBars}
            flowIndex={Math.round((counts.completed / Math.max(counts.all, 1)) * 100)}
            deepWorkHours={Math.round((counts.completed + counts.pending * 0.5) * 1.2)}
          />

          <TodoInsightCard
            text="Users who complete mindfulness tasks before 10 AM show a 24% increase in sustained focus throughout the day."
          />
        </div>
      </section>
    </div>
  )
}

export default TodoPage
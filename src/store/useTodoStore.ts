import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { format, isSameDay, subDays } from 'date-fns'
import { createZustandStorage } from '../lib/storage'
import { generateId, getTodayISO } from '../lib/utils'
import type { Todo, TodoList, TodoStoreState } from '../types/todo.types'

type TodoStoreActions = {
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTodo: (id: string, patch: Partial<Todo>) => void
  deleteTodo: (id: string) => void
  toggleTodo: (id: string) => void
  reorderTodos: (ids: string[]) => void
  addList: (list: Omit<TodoList, 'id'>) => void
  deleteList: (id: string) => void
}

export type TodoStore = TodoStoreState & TodoStoreActions

const initialState: TodoStoreState = {
  todos: [],
  lists: [],
}

function reorderItems(items: Todo[], ids: string[]): Todo[] {
  const itemMap = new Map(items.map((item) => [item.id, item] as const))
  const ordered = ids.map((id) => itemMap.get(id)).filter(
    (item): item is Todo => item !== undefined,
  )
  const remaining = items.filter((item) => !ids.includes(item.id))

  return [...ordered, ...remaining]
}

export const useTodoStore = create<TodoStore>()(
  persist(
    immer((set) => ({
      ...initialState,
      addTodo: (todo) => {
        set((state) => {
          const now = new Date().toISOString()

          state.todos.push({
            ...todo,
            id: generateId(),
            createdAt: now,
            updatedAt: now,
          })
        })
      },
      updateTodo: (id, patch) => {
        set((state) => {
          const todo = state.todos.find((item) => item.id === id)

          if (todo) {
            Object.assign(todo, patch)
            todo.updatedAt = new Date().toISOString()
          }
        })
      },
      deleteTodo: (id) => {
        set((state) => {
          state.todos = state.todos.filter((todo) => todo.id !== id)
        })
      },
      toggleTodo: (id) => {
        set((state) => {
          const todo = state.todos.find((item) => item.id === id)

          if (todo) {
            todo.done = !todo.done
            todo.updatedAt = new Date().toISOString()
          }
        })
      },
      reorderTodos: (ids) => {
        set((state) => {
          state.todos = reorderItems(state.todos, ids)
        })
      },
      addList: (list) => {
        set((state) => {
          state.lists.push({
            ...list,
            id: generateId(),
          })
        })
      },
      deleteList: (id) => {
        set((state) => {
          state.lists = state.lists.filter((list) => list.id !== id)
          state.todos = state.todos.filter((todo) => todo.listId !== id)
        })
      },
    })),
    {
      name: 'mybase-todos',
      storage: createZustandStorage(),
      partialize: (state) => ({ todos: state.todos, lists: state.lists }),
    },
  ),
)

export function getTodosByList(listId: string): Todo[] {
  return useTodoStore.getState().todos.filter((todo) => todo.listId === listId)
}

export function getTodaysTodos(todos: Todo[]): Todo[] {
  const today = getTodayISO()
  return todos.filter((todo) => todo.dueDate === today)
}

export function getPendingTodos(todos: Todo[]): Todo[] {
  return todos.filter((todo) => !todo.done)
}

export function getCompletedTodos(todos: Todo[]): Todo[] {
  return todos.filter((todo) => todo.done)
}

export function getFilteredTodos(
  todos: Todo[],
  activeFilter: 'all' | 'pending' | 'completed' | 'today',
  activeListId: string,
  searchValue: string,
  archiveOnly: boolean,
): Todo[] {
  const lowered = searchValue.trim().toLowerCase()

  const byArchive = archiveOnly ? todos.filter((todo) => todo.done) : todos
  const byFilter =
    activeFilter === 'pending'
      ? byArchive.filter((todo) => !todo.done)
      : activeFilter === 'completed'
      ? byArchive.filter((todo) => todo.done)
      : activeFilter === 'today'
      ? getTodaysTodos(byArchive)
      : byArchive

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
}

export interface TodoMomentumDay {
  dayLabel: string
  completed: number
  totalTouched: number
}

export interface TodoMomentumData {
  days: TodoMomentumDay[]
  completionRate: number
  completedThisWeek: number
}

export function getTodoMomentumData(todos: Todo[]): TodoMomentumData {
  const reference = new Date()
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = subDays(reference, 6 - index)
    const completed = todos.filter((todo) => todo.done && isSameDay(new Date(todo.updatedAt), date)).length
    const totalTouched = todos.filter((todo) => isSameDay(new Date(todo.updatedAt), date)).length

    return {
      dayLabel: format(date, 'EEE'),
      completed,
      totalTouched,
    }
  })

  const completedThisWeek = days.reduce((sum, day) => sum + day.completed, 0)
  const totalDone = todos.filter((todo) => todo.done).length
  const completionRate = todos.length ? Math.round((totalDone / todos.length) * 100) : 0

  return {
    days,
    completionRate,
    completedThisWeek,
  }
}
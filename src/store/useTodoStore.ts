import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { createZustandStorage } from '../lib/storage'
import { generateId, getTodayISO } from '../lib/utils'
import type { Todo, TodoList, TodoStoreState } from '../types/todo.types'

type TodoStoreActions = {
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void
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
          state.todos.push({
            ...todo,
            id: generateId(),
            createdAt: new Date().toISOString(),
          })
        })
      },
      updateTodo: (id, patch) => {
        set((state) => {
          const todo = state.todos.find((item) => item.id === id)

          if (todo) {
            Object.assign(todo, patch)
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

export function getTodaysTodos(): Todo[] {
  const today = getTodayISO()
  return useTodoStore.getState().todos.filter((todo) => todo.dueDate === today)
}

export function getPendingTodos(): Todo[] {
  return useTodoStore.getState().todos.filter((todo) => !todo.done)
}

export function getCompletedTodos(): Todo[] {
  return useTodoStore.getState().todos.filter((todo) => todo.done)
}
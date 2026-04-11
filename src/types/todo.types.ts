export type Priority = 'low' | 'med' | 'high'

export interface TodoList {
  id: string
  name: string
  color: string
}

export interface Todo {
  id: string
  title: string
  note?: string
  priority: Priority
  dueDate?: string
  listId?: string
  done: boolean
  createdAt: string
}

export interface TodoStoreState {
  todos: Todo[]
  lists: TodoList[]
}
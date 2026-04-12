import { Check, Plus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface TodoItem {
  id: string
  label: string
  done: boolean
}

interface TodosCardProps {
  items: TodoItem[]
  onToggleTodo: (id: string) => void
  onAddTodo: (label: string) => void
  onViewAll: () => void
}

export function TodosCard({ items, onToggleTodo, onAddTodo, onViewAll }: TodosCardProps) {
  const [nextTodo, setNextTodo] = useState('')

  const navigate = useNavigate()

  function handleAddTodo() {
    const normalized = nextTodo.trim()

    if (!normalized) {
      return
    }

    onAddTodo(normalized)
    setNextTodo('')
  }

  return (
    <section className="rounded-xl bg-surface-container-lowest p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-2xl font-bold">Today&apos;s Todos</h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-sm font-bold text-primary hover:text-primary-dim"
        >
          View All
        </button>
      </div>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 rounded-lg bg-surface-container-low px-3 py-3">
            <button
              type="button"
              onClick={() => onToggleTodo(item.id)}
              className={[
                'inline-flex h-5 w-5 items-center justify-center rounded-sm border-2 text-xs font-black',
                item.done
                  ? 'border-primary bg-primary text-on-primary'
                  : 'border-outline text-transparent',
              ].join(' ')}
              aria-label={item.done ? 'Mark todo as pending' : 'Mark todo as done'}
            >
              <Check size={12} />
            </button>
            <span className={item.done ? 'text-on-surface-variant line-through' : 'text-on-surface'}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex gap-2">
        {/* <input
          type="text"
          value={nextTodo}
          onChange={(event) => setNextTodo(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleAddTodo()
            }
          }}
          placeholder="Add task"
          className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm"
        /> */}
        <button
          type="button"
          onClick={() => {
            console.log('Add todo requested')
            navigate('/todos')
          }}
          className="inline-flex w-full items-center justify-center  gap-2 border rounded-full  border-primary border-dashed text-primary px-3 py-2 text-sm font-bold text-on-primary hover:bg-on-primary cursor-pointer transition-colors"
        >
          <Plus size={14} />
          <span>Add Task</span>
        </button>
      </div>
    </section>
  )
}
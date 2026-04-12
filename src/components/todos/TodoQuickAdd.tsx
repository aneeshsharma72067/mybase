import { Plus } from 'lucide-react'
import { useState } from 'react'
import type { Priority, TodoList } from '../../types/todo.types'
import { getTodayISO } from '../../lib/utils'

interface TodoQuickAddProps {
  lists: TodoList[]
  activeListId: string
  onCreate: (input: {
    title: string
    note?: string
    priority: Priority
    dueDate?: string
    listId?: string
    done: boolean
  }) => void
}

export function TodoQuickAdd({ lists, activeListId, onCreate }: TodoQuickAddProps) {
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [priority, setPriority] = useState<Priority>('med')
  const [dueDate, setDueDate] = useState(getTodayISO())

  function handleCreate() {
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      return
    }

    onCreate({
      title: trimmedTitle,
      note: note.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
      listId: activeListId === 'all' ? lists[0]?.id : activeListId,
      done: false,
    })

    setTitle('')
    setNote('')
  }

  return (
    <section className="rounded-xl border-2 border-dashed border-outline-variant/35 bg-surface-container-lowest p-4">
      <div className="flex flex-wrap gap-2 lg:grid-cols-[2fr_2fr_1fr_1fr_auto]">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleCreate()
            }
          }}
          placeholder="Task title"
          className="rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm"
        />

        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Context / category"
          className="rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm"
        />

        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value as Priority)}
          className="rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm"
        >
          <option value="low">Low</option>
          <option value="med">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          className="rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm"
        />

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary hover:bg-primary-dim"
        >
          <Plus size={14} />
          <span>Add</span>
        </button>
      </div>
    </section>
  )
}
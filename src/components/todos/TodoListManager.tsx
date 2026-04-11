import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { TodoList } from '../../types/todo.types'

interface TodoListManagerProps {
  lists: TodoList[]
  activeListId: string
  onActiveListChange: (listId: string) => void
  onAddList: (name: string, color: string) => void
  onDeleteList: (id: string) => void
}

const defaultColors = ['#2d6a4f', '#40665d', '#2c6a4e', '#a83836']

export function TodoListManager({
  lists,
  activeListId,
  onActiveListChange,
  onAddList,
  onDeleteList,
}: TodoListManagerProps) {
  const [name, setName] = useState('')

  function handleCreateList() {
    const trimmedName = name.trim()

    if (!trimmedName) {
      return
    }

    const nextColor = defaultColors[lists.length % defaultColors.length]
    onAddList(trimmedName, nextColor)
    setName('')
  }

  return (
    <section className="rounded-xl bg-surface-container-low p-4">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">Lists</p>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onActiveListChange('all')}
          className={[
            'rounded-full px-3 py-1 text-xs font-semibold',
            activeListId === 'all' ? 'bg-primary text-on-primary' : 'bg-surface text-on-surface-variant hover:bg-surface-container-high',
          ].join(' ')}
        >
          All
        </button>

        {lists.map((list) => (
          <div key={list.id} className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={() => onActiveListChange(list.id)}
              className={[
                'rounded-full px-3 py-1 text-xs font-semibold',
                activeListId === list.id ? 'bg-primary text-on-primary' : 'bg-surface text-on-surface-variant hover:bg-surface-container-high',
              ].join(' ')}
            >
              <span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: list.color }} />
              {list.name}
            </button>

            <button
              type="button"
              onClick={() => onDeleteList(list.id)}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-outline hover:bg-surface hover:text-error"
              aria-label={`Delete list ${list.name}`}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleCreateList()
            }
          }}
          placeholder="New list"
          className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={handleCreateList}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-on-primary hover:bg-primary-dim"
        >
          Add
        </button>
      </div>
    </section>
  )
}
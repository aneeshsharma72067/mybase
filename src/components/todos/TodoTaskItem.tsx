import { ArrowDown, ArrowUp, Check, Pencil, Save, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import type { Priority, Todo } from '../../types/todo.types'

interface TodoTaskItemProps {
  todo: Todo
  listName?: string
  onToggle: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onUpdate: (patch: Partial<Todo>) => void
}

const priorityTone: Record<Priority, string> = {
  high: 'bg-primary-container text-on-primary-container',
  med: 'bg-secondary-container text-on-secondary-container',
  low: 'bg-tertiary-container text-on-tertiary-container',
}

export function TodoTaskItem({
  todo,
  listName,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
  onUpdate,
}: TodoTaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(todo.title)
  const [draftNote, setDraftNote] = useState(todo.note ?? '')

  function handleSave() {
    const nextTitle = draftTitle.trim()

    if (!nextTitle) {
      return
    }

    onUpdate({ title: nextTitle, note: draftNote.trim() || undefined })
    setIsEditing(false)
  }

  return (
    <article className={[
      'rounded-xl bg-surface-container-lowest p-5 transition-colors hover:bg-surface-container',
      todo.done ? 'opacity-75' : '',
    ].join(' ')}>
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={onToggle}
          className={[
            'mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors',
            todo.done ? 'border-primary bg-primary text-on-primary' : 'border-primary/30 hover:border-primary',
          ].join(' ')}
          aria-label={todo.done ? 'Mark task as pending' : 'Mark task as complete'}
        >
          <Check size={14} />
        </button>

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <input
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm font-semibold"
              />
              <input
                value={draftNote}
                onChange={(event) => setDraftNote(event.target.value)}
                className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-xs"
                placeholder="Optional note"
              />
            </div>
          ) : (
            <>
              <h3 className={[
                'font-display text-xl font-bold tracking-tight text-on-surface',
                todo.done ? 'line-through opacity-50' : '',
              ].join(' ')}>
                {todo.title}
              </h3>
              <p className="mt-1 text-sm text-outline">{todo.note || listName || 'General'}</p>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className={[
            'rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider',
            todo.done ? 'bg-surface-container-highest text-on-surface-variant' : priorityTone[todo.priority],
          ].join(' ')}>
            {todo.done ? 'done' : `${todo.priority} priority`}
          </span>

          <button
            type="button"
            onClick={onMoveUp}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-outline hover:bg-surface hover:text-primary"
            aria-label="Move task up"
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-outline hover:bg-surface hover:text-primary"
            aria-label="Move task down"
          >
            <ArrowDown size={14} />
          </button>

          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-outline hover:bg-surface hover:text-primary"
                aria-label="Save task"
              >
                <Save size={14} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setDraftTitle(todo.title)
                  setDraftNote(todo.note ?? '')
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-outline hover:bg-surface hover:text-error"
                aria-label="Cancel editing"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-outline hover:bg-surface hover:text-primary"
              aria-label="Edit task"
            >
              <Pencil size={14} />
            </button>
          )}

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-outline hover:bg-surface hover:text-error"
            aria-label="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </article>
  )
}
import type { LucideIcon } from 'lucide-react'
import { MoreVertical } from 'lucide-react'

interface GoalListRowProps {
  icon: LucideIcon
  title: string
  category: string
  categoryTone: 'primary' | 'secondary' | 'tertiary'
  progress: number
  progressLabel: string
  deadline: string
  deadlineHint: string
  deadlineTone: 'primary' | 'error' | 'muted'
  status: string
  statusTone: 'primary' | 'secondary' | 'muted'
}

export function GoalListRow({
  icon: Icon,
  title,
  category,
  categoryTone,
  progress,
  progressLabel,
  deadline,
  deadlineHint,
  deadlineTone,
  status,
  statusTone,
}: GoalListRowProps) {
  const iconToneClass =
    categoryTone === 'secondary'
      ? 'bg-secondary-container/30 text-secondary'
      : categoryTone === 'tertiary'
      ? 'bg-tertiary-container/30 text-tertiary'
      : 'bg-primary-container/30 text-primary'

  const chipToneClass =
    categoryTone === 'secondary'
      ? 'bg-secondary-container text-on-secondary-container'
      : categoryTone === 'tertiary'
      ? 'bg-tertiary-container text-on-tertiary-container'
      : 'bg-primary-container text-on-primary-container'

  const barToneClass =
    categoryTone === 'secondary' ? 'bg-secondary' : categoryTone === 'tertiary' ? 'bg-tertiary' : 'bg-primary'

  const deadlineToneClass =
    deadlineTone === 'error' ? 'text-error' : deadlineTone === 'primary' ? 'text-primary' : 'text-on-surface-variant'

  const statusToneClass =
    statusTone === 'secondary' ? 'text-secondary' : statusTone === 'primary' ? 'text-primary' : 'text-on-surface-variant'

  const dotToneClass =
    statusTone === 'secondary' ? 'bg-secondary' : statusTone === 'primary' ? 'bg-primary' : 'bg-outline-variant'

  return (
    <tr className="group cursor-pointer transition-colors hover:bg-surface-container-low">
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <div className={[ 'flex h-10 w-10 items-center justify-center rounded-lg', iconToneClass ].join(' ')}>
            <Icon size={16} />
          </div>
          <span className="font-bold text-on-surface">{title}</span>
        </div>
      </td>

      <td className="px-6 py-6">
        <span className={[ 'rounded-full px-3 py-1 text-xs font-bold', chipToneClass ].join(' ')}>{category}</span>
      </td>

      <td className="w-72 px-6 py-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
            <span>{progress}%</span>
            <span>{progressLabel}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
            <div className={[ 'h-full rounded-full', barToneClass ].join(' ')} style={{ width: `${progress}%` }} />
          </div>
        </div>
      </td>

      <td className="px-6 py-6">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-on-surface">{deadline}</span>
          <span className={[ 'text-[10px] font-bold uppercase tracking-wider', deadlineToneClass ].join(' ')}>{deadlineHint}</span>
        </div>
      </td>

      <td className="px-6 py-6">
        <span className={[ 'flex items-center gap-1.5 text-xs font-bold', statusToneClass ].join(' ')}>
          <span className={[ 'h-2 w-2 rounded-full', dotToneClass ].join(' ')} />
          {status}
        </span>
      </td>

      <td className="px-8 py-6 text-right">
        <button
          type="button"
          className="rounded-full p-2 text-on-surface-variant opacity-0 transition-opacity hover:bg-surface-container-high group-hover:opacity-100"
          aria-label={`Open actions for ${title}`}
        >
          <MoreVertical size={16} />
        </button>
      </td>
    </tr>
  )
}

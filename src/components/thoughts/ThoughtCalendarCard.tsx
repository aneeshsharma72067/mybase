import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useThoughtsStore } from '../../store/useThoughtsStore'

interface ThoughtCalendarCardProps {
  onDateSelect?: (date: Date) => void
}

const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function ThoughtCalendarCard({ onDateSelect }: ThoughtCalendarCardProps) {
  const { thoughts, activeDateFilter, setDateFilter } = useThoughtsStore()
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(new Date()))
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  const monthLabel = format(visibleMonth, 'MMMM yyyy')

  const thoughtsByDate = useMemo(() => {
    return new Set(thoughts.map((thought) => thought.createdAt.slice(0, 10)))
  }, [thoughts])

  const calendarCells = useMemo(() => {
    const firstDay = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn: 0 })
    const lastDay = endOfWeek(endOfMonth(visibleMonth), { weekStartsOn: 0 })

    return eachDayOfInterval({ start: firstDay, end: lastDay })
  }, [visibleMonth])

  useEffect(() => {
    if (activeDateFilter) {
      setVisibleMonth(startOfMonth(new Date(activeDateFilter)))
    }
  }, [activeDateFilter, setVisibleMonth])

  function handleDateSelect(date: Date) {
    const dateKey = format(date, 'yyyy-MM-dd')

    setDateFilter(activeDateFilter === dateKey ? null : dateKey)
    onDateSelect?.(date)
  }

  function goToPreviousMonth() {
    setVisibleMonth((current) => subMonths(current, 1))
  }

  function goToNextMonth() {
    if (visibleMonth.getFullYear() === currentYear && visibleMonth.getMonth() >= currentMonth) {
      return
    }

    setVisibleMonth((current) => addMonths(current, 1))
  }

  return (
    <section className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="font-display text-lg font-bold">{monthLabel}</h4>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="rounded-full p-1 hover:bg-surface-container-low"
            aria-label="Previous month"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={goToNextMonth}
            disabled={visibleMonth.getFullYear() === currentYear && visibleMonth.getMonth() >= currentMonth}
            className="rounded-full p-1 hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next month"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-3 text-center text-[10px] font-bold uppercase tracking-widest text-outline-variant">
        {days.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-y-2 text-center text-xs">
        {calendarCells.map((date) => (
          <button
            type="button"
            key={date.toISOString()}
            onClick={() => {
              if (!isSameMonth(date, visibleMonth)) {
                setVisibleMonth(startOfMonth(date))
              }
              handleDateSelect(date)
            }}
            className={[
              'mx-auto inline-flex h-7 w-7 flex-col items-center justify-center rounded-full leading-none transition-colors',
              isSameMonth(date, visibleMonth) ? 'text-on-surface' : 'text-outline-variant',
              isToday(date) ? 'bg-primary-container text-primary font-bold' : '',
              !isToday(date) && activeDateFilter === format(date, 'yyyy-MM-dd') ? 'border-2 border-primary font-black text-primary' : '',
              !isToday(date) && activeDateFilter !== format(date, 'yyyy-MM-dd') ? 'hover:bg-surface-container-low' : '',
            ].join(' ')}
            aria-label={format(date, 'EEEE, MMMM d, yyyy')}
          >
            <span>{format(date, 'd')}</span>
            {thoughtsByDate.has(format(date, 'yyyy-MM-dd')) ? (
              <span className="mt-0.5 h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
            ) : null}
          </button>
        ))}
      </div>
    </section>
  )
}
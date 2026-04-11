import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ThoughtCalendarCardProps {
  initialDate?: Date
  onDateSelect?: (date: Date) => void
}

const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function ThoughtCalendarCard({ initialDate = new Date(), onDateSelect }: ThoughtCalendarCardProps) {
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(initialDate))
  const [selectedDate, setSelectedDate] = useState(initialDate)

  const monthLabel = format(visibleMonth, 'MMMM yyyy')

  const calendarCells = useMemo(() => {
    const firstDay = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn: 0 })
    const lastDay = endOfWeek(endOfMonth(visibleMonth), { weekStartsOn: 0 })

    return eachDayOfInterval({ start: firstDay, end: lastDay })
  }, [visibleMonth])

  function handleDateSelect(date: Date) {
    setSelectedDate(date)
    onDateSelect?.(date)
  }

  return (
    <section className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="font-display text-lg font-bold">{monthLabel}</h4>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setVisibleMonth((current) => subMonths(current, 1))}
            className="rounded-full p-1 hover:bg-surface-container-low"
            aria-label="Previous month"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
            className="rounded-full p-1 hover:bg-surface-container-low"
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
              'mx-auto inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors',
              isSameMonth(date, visibleMonth) ? 'text-on-surface' : 'text-outline-variant',
              isToday(date) ? 'bg-primary-container text-primary font-bold' : '',
              isSameDay(date, selectedDate) ? 'border-2 border-primary font-black text-primary' : '',
              !isToday(date) && !isSameDay(date, selectedDate) ? 'hover:bg-surface-container-low' : '',
            ].join(' ')}
            aria-label={format(date, 'EEEE, MMMM d, yyyy')}
          >
            {format(date, 'd')}
          </button>
        ))}
      </div>
    </section>
  )
}
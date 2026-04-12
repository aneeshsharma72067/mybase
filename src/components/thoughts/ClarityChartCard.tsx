import { useMemo, useState } from 'react'
import { format, getDaysInMonth, startOfMonth } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useThoughtsStore } from '../../store/useThoughtsStore'

type ClarityViewMode = 'month' | 'year'

type ClarityDatum = {
  label: string
  count: number
}

type BarShapeProps = {
  x?: number
  y?: number
  width?: number
  height?: number
  fill?: string
}

function CustomBarShape({ x, y, width, height, fill }: BarShapeProps) {
  if (x === undefined || y === undefined || width === undefined || height === undefined) {
    return null
  }

  const barHeight = Math.max(height, 4)
  const barY = y + height - barHeight

  return <rect x={x} y={barY} width={width} height={barHeight} rx={8} fill={fill} />
}

export function ClarityChartCard() {
  const { thoughts } = useThoughtsStore()
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const [mode, setMode] = useState<ClarityViewMode>('month')
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)

  const monthName = format(new Date(selectedYear, selectedMonth, 1), 'MMMM')

  const chartData = useMemo<ClarityDatum[]>(() => {
    if (mode === 'month') {
      const monthStart = startOfMonth(new Date(selectedYear, selectedMonth, 1))
      const monthLength = getDaysInMonth(monthStart)

      return Array.from({ length: monthLength }, (_, index) => {
        const day = index + 1
        const dateKey = format(new Date(selectedYear, selectedMonth, day), 'yyyy-MM-dd')

        return {
          label: String(day),
          count: thoughts.filter((thought) => thought.createdAt.startsWith(dateKey)).length,
        }
      })
    }

    return Array.from({ length: 12 }, (_, index) => {
      const monthKey = String(index + 1).padStart(2, '0')
      const yearKey = String(selectedYear)

      return {
        label: format(new Date(selectedYear, index, 1), 'MMM'),
        count: thoughts.filter((thought) => thought.createdAt.startsWith(`${yearKey}-${monthKey}`)).length,
      }
    })
  }, [mode, selectedMonth, selectedYear, thoughts])

  const xAxisTicks = useMemo(() => {
    if (mode === 'month') {
      const lastDay = getDaysInMonth(new Date(selectedYear, selectedMonth, 1))

      return ['1', '5', '10', '15', '20', '25', String(lastDay)].filter(
        (tick, index, self) => self.indexOf(tick) === index && Number(tick) <= lastDay,
      )
    }

    return chartData.map((item) => item.label)
  }, [chartData, mode, selectedMonth, selectedYear])

  function goToPreviousYear() {
    setSelectedYear((current) => current - 1)
  }

  function goToNextYear() {
    setSelectedYear((current) => Math.min(current + 1, currentYear))
  }

  function goToPreviousMonth() {
    setSelectedMonth((currentMonthIndex) => {
      if (currentMonthIndex === 0) {
        setSelectedYear((currentYearValue) => currentYearValue - 1)
        return 11
      }

      return currentMonthIndex - 1
    })
  }

  function goToNextMonth() {
    if (selectedYear === currentYear && selectedMonth === 11) {
      return
    }

    setSelectedMonth((currentMonthIndex) => {
      if (currentMonthIndex === 11) {
        setSelectedYear((currentYearValue) => Math.min(currentYearValue + 1, currentYear))
        return 0
      }

      return currentMonthIndex + 1
    })
  }

  return (
    <section className="rounded-xl bg-surface-container-low p-8 lg:p-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-3xl font-black text-on-surface">Cognitive Clarity</h3>
          <p className="text-sm text-on-surface-variant">Visualizing depth of recorded thoughts over time.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative inline-flex rounded-full bg-surface-container-lowest p-1 text-xs">
            <span
              className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-primary transition-transform duration-300 ease-out"
              style={{ transform: mode === 'month' ? 'translateX(0%)' : 'translateX(100%)' }}
            />
            <button
              type="button"
              onClick={() => setMode('month')}
              className={[
                'relative z-10 rounded-full px-5 py-2 font-bold transition-colors',
                mode === 'month' ? 'text-on-primary' : 'text-on-surface-variant hover:text-primary',
              ].join(' ')}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setMode('year')}
              className={[
                'relative z-10 rounded-full px-5 py-2 font-bold transition-colors',
                mode === 'year' ? 'text-on-primary' : 'text-on-surface-variant hover:text-primary',
              ].join(' ')}
            >
              Year
            </button>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-surface-container-lowest p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={mode === 'month' ? goToPreviousMonth : goToPreviousYear}
              className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
              aria-label={mode === 'month' ? 'Previous month' : 'Previous year'}
            >
              <ChevronLeft size={14} />
            </button>
            <span className="min-w-16 px-2 text-center text-on-surface">{mode === 'month' ? monthName : selectedYear}</span>
            <button
              type="button"
              onClick={mode === 'month' ? goToNextMonth : goToNextYear}
              disabled={mode === 'year' && selectedYear >= currentYear}
              className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={mode === 'month' ? 'Next month' : 'Next year'}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 0, left: -10, bottom: 0 }} barCategoryGap={mode === 'month' ? 16 : 12}>
            <CartesianGrid vertical={false} stroke="var(--color-outline-variant)" strokeOpacity={0.18} />
            <XAxis
              dataKey="label"
              ticks={xAxisTicks}
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12, fontWeight: 600 }}
            />
            <YAxis hide domain={[0, 'dataMax + 1']} />
            <Bar
              dataKey="count"
              radius={[8, 8, 0, 0]}
              shape={(barProps: BarShapeProps) => <CustomBarShape {...barProps} fill="var(--color-primary)" />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
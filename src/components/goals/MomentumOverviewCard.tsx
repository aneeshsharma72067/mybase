import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'

interface MomentumOverviewCardProps {
  momentum: { day: string; count: number }[]
  note: string
}

type MomentumBarShapeProps = {
  x?: number
  y?: number
  width?: number
  height?: number
  fill?: string
}

function MomentumBarShape({ x, y, width, height, fill }: MomentumBarShapeProps) {
  if (x === undefined || y === undefined || width === undefined || height === undefined) {
    return null
  }

  const barHeight = Math.max(height, 4)
  const barY = y + height - barHeight

  return <rect x={x} y={barY} width={width} height={barHeight} rx={999} fill={fill} />
}

export function MomentumOverviewCard({ momentum, note }: MomentumOverviewCardProps) {
  const ticks = useMemo(() => momentum.map((entry) => entry.day), [momentum])

  return (
    <section className="col-span-12 flex h-72 flex-col rounded-xl bg-surface-container-high p-8 lg:col-span-4 lg:h-80 lg:p-10">
      <h3 className="font-display text-xl font-bold text-on-surface">Momentum Overview</h3>

      <div className="mt-8 min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={momentum} margin={{ top: 4, right: 0, left: -10, bottom: 0 }} barCategoryGap={12}>
            <CartesianGrid vertical={false} stroke="var(--color-outline-variant)" strokeOpacity={0.16} />
            <XAxis
              dataKey="day"
              ticks={ticks}
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 11, fontWeight: 600 }}
            />
            <YAxis hide domain={[0, 'dataMax + 1']} />
            <Bar dataKey="count" shape={(barProps: MomentumBarShapeProps) => <MomentumBarShape {...barProps} fill="var(--color-primary)" />} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-sm text-on-surface-variant">
        {note}
      </p>
    </section>
  )
}
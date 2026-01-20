import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { formatDuration } from '@/hooks/useRecords'
import type { Record } from '@/types'
import type { Period } from './PeriodSelector'

interface DailyTrendChartProps {
  records: Record[]
  period: Period
}

interface ChartData {
  date: string
  label: string
  duration: number
}

function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0]
}

function formatDateLabel(dateStr: string, period: Period): string {
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()

  if (period === '1w') {
    const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
    return `${month}/${day}\n${weekday}`
  }
  return `${month}/${day}`
}

function getDatesInRange(start: Date, end: Date): string[] {
  const dates: string[] = []
  const current = new Date(start)

  while (current <= end) {
    dates.push(formatDateKey(current))
    current.setDate(current.getDate() + 1)
  }

  return dates
}

export function DailyTrendChart({ records, period }: DailyTrendChartProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        データがありません
      </div>
    )
  }

  // Get date range
  const dates = records.map(r => new Date(r.start_time))
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())))
  const maxDate = new Date()

  minDate.setHours(0, 0, 0, 0)
  maxDate.setHours(23, 59, 59, 999)

  // Aggregate duration by date
  const dateDurations = new Map<string, number>()
  for (const record of records) {
    const dateKey = formatDateKey(new Date(record.start_time))
    const current = dateDurations.get(dateKey) ?? 0
    dateDurations.set(dateKey, current + (record.duration ?? 0))
  }

  // Create chart data for all dates in range
  const allDates = getDatesInRange(minDate, maxDate)
  const chartData: ChartData[] = allDates.map(dateStr => ({
    date: dateStr,
    label: formatDateLabel(dateStr, period),
    duration: dateDurations.get(dateStr) ?? 0,
  }))

  // For longer periods, show fewer labels
  const tickInterval = period === '1w' ? 0 : period === '1m' ? 6 : 13

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: { value: number }[]
    label?: string
  }) => {
    if (active && payload && payload.length && label) {
      const date = new Date(label)
      const month = date.getMonth() + 1
      const day = date.getDate()
      const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]

      return (
        <div className="bg-popover border rounded-lg px-3 py-2 shadow-lg">
          <p className="font-medium">
            {month}月{day}日 ({weekday})
          </p>
          <p className="text-sm text-muted-foreground">
            {formatDuration(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  // Calculate average for the period
  const daysWithRecords = chartData.filter(d => d.duration > 0).length
  const totalDuration = chartData.reduce((sum, d) => sum + d.duration, 0)
  const avgDuration = daysWithRecords > 0 ? Math.round(totalDuration / daysWithRecords) : 0

  return (
    <div>
      <div className="flex justify-center gap-8 mb-4 text-sm">
        <div className="text-center">
          <div className="font-mono font-medium">{formatDuration(avgDuration)}</div>
          <div className="text-muted-foreground">1日平均</div>
        </div>
        <div className="text-center">
          <div className="font-mono font-medium">{daysWithRecords}日</div>
          <div className="text-muted-foreground">記録日数</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            tickFormatter={(value: string) => formatDateLabel(value, period)}
            interval={tickInterval}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value: number) => {
              const hours = Math.floor(value / 3600)
              return `${hours}h`
            }}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="duration" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

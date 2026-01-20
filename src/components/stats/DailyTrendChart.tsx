import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { formatDuration } from '@/hooks/useRecords'
import type { Record } from '@/types'

interface DailyTrendChartProps {
  records: Record[]
}

interface ChartData {
  date: string
  daily: number
  cumulative: number
}

function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0]
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  return `${year}/${month}`
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

export function DailyTrendChart({ records }: DailyTrendChartProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        データがありません
      </div>
    )
  }

  // Get date range from records
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

  // Create chart data for all dates in range with cumulative values
  const allDates = getDatesInRange(minDate, maxDate)
  let cumulative = 0
  const chartData: ChartData[] = allDates.map(dateStr => {
    const daily = dateDurations.get(dateStr) ?? 0
    cumulative += daily
    return {
      date: dateStr,
      daily,
      cumulative,
    }
  })

  // Show fewer labels for readability
  const tickInterval = Math.max(1, Math.floor(chartData.length / 6))

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: { value: number; dataKey: string }[]
    label?: string
  }) => {
    if (active && payload && payload.length && label) {
      const date = new Date(label)
      const month = date.getMonth() + 1
      const day = date.getDate()
      const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
      const cumulativeValue = payload.find(p => p.dataKey === 'cumulative')?.value ?? 0
      const dailyValue = chartData.find(d => d.date === label)?.daily ?? 0

      return (
        <div className="bg-popover border rounded-lg px-3 py-2 shadow-lg">
          <p className="font-medium">
            {month}月{day}日 ({weekday})
          </p>
          <p className="text-sm text-muted-foreground">
            この日: {formatDuration(dailyValue)}
          </p>
          <p className="text-sm text-primary font-medium">
            累計: {formatDuration(cumulativeValue)}
          </p>
        </div>
      )
    }
    return null
  }

  // Calculate stats
  const daysWithRecords = chartData.filter(d => d.daily > 0).length
  const totalDuration = chartData[chartData.length - 1]?.cumulative ?? 0
  const avgDuration = daysWithRecords > 0 ? Math.round(totalDuration / daysWithRecords) : 0

  return (
    <div>
      <div className="flex justify-center gap-8 mb-4 text-sm">
        <div className="text-center">
          <div className="font-mono font-medium">{formatDuration(totalDuration)}</div>
          <div className="text-muted-foreground">累計</div>
        </div>
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
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDateLabel}
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
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#colorCumulative)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

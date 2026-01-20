import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useTags } from '@/hooks/useTags'
import { formatDuration } from '@/hooks/useRecords'
import type { Record } from '@/types'

interface TagBreakdownChartProps {
  records: Record[]
}

interface ChartData {
  name: string
  value: number
  color: string
  [key: string]: string | number
}

export function TagBreakdownChart({ records }: TagBreakdownChartProps) {
  const { data: tags } = useTags()

  if (!tags || records.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        データがありません
      </div>
    )
  }

  // Aggregate duration by tag
  const tagDurations = new Map<string, number>()
  for (const record of records) {
    const current = tagDurations.get(record.tag_id) ?? 0
    tagDurations.set(record.tag_id, current + (record.duration ?? 0))
  }

  // Convert to chart data
  const chartData: ChartData[] = []
  for (const [tagId, duration] of tagDurations) {
    const tag = tags.find(t => t.id === tagId)
    if (tag && duration > 0) {
      chartData.push({
        name: tag.name,
        value: duration,
        color: tag.color,
      })
    }
  }

  // Sort by value descending
  chartData.sort((a, b) => b.value - a.value)

  const totalDuration = chartData.reduce((sum, d) => sum + d.value, 0)

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage = ((data.value / totalDuration) * 100).toFixed(1)
      return (
        <div className="bg-popover border rounded-lg px-3 py-2 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatDuration(data.value)} ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  const renderLegend = () => {
    return (
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {chartData.map(entry => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-4">
        <div className="text-2xl font-bold font-mono">
          {formatDuration(totalDuration)}
        </div>
        <div className="text-sm text-muted-foreground">合計時間</div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {renderLegend()}
    </div>
  )
}

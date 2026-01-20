import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useTags, buildTagTree } from '@/hooks/useTags'
import { formatDuration } from '@/hooks/useRecords'
import { getTagDisplayColor } from '@/lib/color'
import type { Record, Tag } from '@/types'

interface TagBreakdownChartProps {
  records: Record[]
}

interface ChartData {
  id: string
  name: string
  value: number
  color: string
  [key: string]: string | number
}

interface TagWithDuration {
  tag: Tag
  duration: number
  children: TagWithDuration[]
}

export function TagBreakdownChart({ records }: TagBreakdownChartProps) {
  const { data: tags } = useTags()
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set())

  if (!tags || records.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        データがありません
      </div>
    )
  }

  // 各タグIDごとの直接の記録時間を集計
  const directDurations = new Map<string, number>()
  for (const record of records) {
    const current = directDurations.get(record.tag_id) ?? 0
    directDurations.set(record.tag_id, current + (record.duration ?? 0))
  }

  // ツリー構造を構築
  const tagTree = buildTagTree(tags)

  // ツリー構造に時間情報を追加
  function buildDurationTree(
    treeNode: Tag & { children: Tag[] }
  ): TagWithDuration | null {
    const directDuration = directDurations.get(treeNode.id) ?? 0
    const childrenWithDuration: TagWithDuration[] = []

    let childrenTotal = 0
    for (const child of treeNode.children) {
      const childNode = buildDurationTree(child as Tag & { children: Tag[] })
      if (childNode && childNode.duration > 0) {
        childrenWithDuration.push(childNode)
        childrenTotal += childNode.duration
      }
    }

    const totalDuration = directDuration + childrenTotal

    if (totalDuration === 0) {
      return null
    }

    return {
      tag: treeNode,
      duration: totalDuration,
      children: childrenWithDuration,
    }
  }

  const durationTree: TagWithDuration[] = []
  for (const root of tagTree) {
    const node = buildDurationTree(root as Tag & { children: Tag[] })
    if (node) {
      durationTree.push(node)
    }
  }

  // 円グラフ用データ（親タグレベル）
  const chartData: ChartData[] = durationTree
    .map(node => ({
      id: node.tag.id,
      name: node.tag.name,
      value: node.duration,
      color: getTagDisplayColor(node.tag, tags),
    }))
    .sort((a, b) => b.value - a.value)

  const totalDuration = chartData.reduce((sum, d) => sum + d.value, 0)

  const toggleExpand = (tagId: string) => {
    setExpandedTags(prev => {
      const next = new Set(prev)
      if (next.has(tagId)) {
        next.delete(tagId)
      } else {
        next.add(tagId)
      }
      return next
    })
  }

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: { name: string; value: number }[]
  }) => {
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

  // 階層的なレジェンド
  const renderTagItem = (
    node: TagWithDuration,
    depth: number,
    percentage: number
  ) => {
    const hasChildren = node.children.length > 0
    const isExpanded = expandedTags.has(node.tag.id)
    const displayColor = getTagDisplayColor(node.tag, tags)

    return (
      <div key={node.tag.id}>
        <div
          className={`flex items-center gap-2 py-1 px-2 rounded ${hasChildren ? 'cursor-pointer hover:bg-accent/50' : ''}`}
          style={{ paddingLeft: depth * 16 + 8 }}
          onClick={() => hasChildren && toggleExpand(node.tag.id)}
        >
          {hasChildren ? (
            <button className="w-4 h-4 flex items-center justify-center text-muted-foreground">
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          ) : (
            <div className="w-4" />
          )}
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: displayColor }}
          />
          <span className="text-sm flex-1">{node.tag.name}</span>
          <span className="text-sm text-muted-foreground font-mono">
            {formatDuration(node.duration)}
          </span>
          <span className="text-xs text-muted-foreground w-12 text-right">
            {percentage.toFixed(1)}%
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children
              .sort((a, b) => b.duration - a.duration)
              .map(child => {
                const childPercentage = (child.duration / totalDuration) * 100
                return renderTagItem(child, depth + 1, childPercentage)
              })}
          </div>
        )}
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
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
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

      {/* 階層的なレジェンド */}
      <div className="mt-4 border rounded-lg bg-card">
        {durationTree
          .sort((a, b) => b.duration - a.duration)
          .map(node => {
            const percentage = (node.duration / totalDuration) * 100
            return renderTagItem(node, 0, percentage)
          })}
      </div>
    </div>
  )
}

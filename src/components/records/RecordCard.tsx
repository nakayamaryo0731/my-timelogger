import { Card } from '@/components/ui/card'
import { useTags } from '@/hooks/useTags'
import { formatDuration } from '@/hooks/useRecords'
import type { Record } from '@/types'

interface RecordCardProps {
  record: Record
  onClick?: () => void
}

function formatTimeRange(startTime: string, endTime: string | null): string {
  const start = new Date(startTime)
  const startStr = start.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  })

  if (!endTime) {
    return `${startStr} - 計測中`
  }

  const end = new Date(endTime)
  const endStr = end.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return `${startStr} - ${endStr}`
}

export function RecordCard({ record, onClick }: RecordCardProps) {
  const { data: tags } = useTags()
  const tag = tags?.find(t => t.id === record.tag_id)

  return (
    <Card
      className={`p-4 ${onClick ? 'cursor-pointer hover:bg-accent/50 transition-colors' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {tag && (
              <>
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="font-medium truncate">{tag.name}</span>
              </>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {formatTimeRange(record.start_time, record.end_time)}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-mono font-medium">
            {record.duration ? formatDuration(record.duration) : '-'}
          </div>
        </div>
      </div>
      {record.note && (
        <div className="mt-2 text-sm text-muted-foreground truncate">
          {record.note}
        </div>
      )}
    </Card>
  )
}

import { useTodayRecords, calculateTotalDuration, formatDuration } from '@/hooks/useRecords'
import { RecordCard } from './RecordCard'

export function TodayRecordsList() {
  const { data: records, isLoading } = useTodayRecords()

  const totalDuration = records ? calculateTotalDuration(records) : 0

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">今日の記録</h2>
        <span className="text-sm text-muted-foreground">
          計 {formatDuration(totalDuration)}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-20 bg-card rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : records && records.length > 0 ? (
        <div className="space-y-3">
          {records.map(record => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          まだ記録がありません
        </div>
      )}
    </section>
  )
}

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DateNavigation } from '@/components/records/DateNavigation'
import { RecordCard } from '@/components/records/RecordCard'
import { RecordEditModal } from '@/components/records/RecordEditModal'
import { useRecordsByDate, formatDuration } from '@/hooks/useRecords'
import type { Record } from '@/types'

export function HistoryPage() {
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<Record | null>(null)

  const { data: records, isLoading } = useRecordsByDate(selectedDate)

  const totalDuration = records?.reduce((sum, r) => sum + (r.duration ?? 0), 0) ?? 0

  const handleCreate = () => {
    setEditingRecord(null)
    setModalOpen(true)
  }

  const handleEdit = (record: Record) => {
    setEditingRecord(record)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditingRecord(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">記録一覧</h2>
        <Button size="icon" onClick={handleCreate}>
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <DateNavigation date={selectedDate} onChange={setSelectedDate} />

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          読み込み中...
        </div>
      ) : records && records.length > 0 ? (
        <>
          <div className="text-sm text-muted-foreground text-center">
            合計: {formatDuration(totalDuration)}
          </div>
          <div className="space-y-3">
            {records.map(record => (
              <RecordCard
                key={record.id}
                record={record}
                onClick={() => handleEdit(record)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          この日の記録はありません
        </div>
      )}

      <RecordEditModal
        open={modalOpen}
        onClose={handleClose}
        record={editingRecord}
        defaultDate={selectedDate}
      />
    </div>
  )
}

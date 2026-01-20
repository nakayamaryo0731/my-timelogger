import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TagSelector } from '@/components/tags/TagSelector'
import { useCreateRecord, useUpdateRecord, useDeleteRecord } from '@/hooks/useRecords'
import type { Record } from '@/types'

interface RecordEditModalProps {
  open: boolean
  onClose: () => void
  record?: Record | null // null = 新規作成
  defaultDate?: Date
}

function toLocalDateTimeString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function RecordEditModal({
  open,
  onClose,
  record,
  defaultDate,
}: RecordEditModalProps) {
  const createRecord = useCreateRecord()
  const updateRecord = useUpdateRecord()
  const deleteRecord = useDeleteRecord()

  const [tagId, setTagId] = useState<string | null>(null)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [note, setNote] = useState('')

  const isEditing = !!record

  useEffect(() => {
    if (record) {
      setTagId(record.tag_id)
      setStartTime(toLocalDateTimeString(new Date(record.start_time)))
      setEndTime(record.end_time ? toLocalDateTimeString(new Date(record.end_time)) : '')
      setNote(record.note ?? '')
    } else {
      setTagId(null)
      const now = defaultDate ?? new Date()
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      setStartTime(toLocalDateTimeString(oneHourAgo))
      setEndTime(toLocalDateTimeString(now))
      setNote('')
    }
  }, [record, defaultDate, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tagId || !startTime || !endTime) return

    const startDate = new Date(startTime)
    const endDate = new Date(endTime)

    if (endDate <= startDate) {
      alert('終了時間は開始時間より後にしてください')
      return
    }

    if (isEditing && record) {
      await updateRecord.mutateAsync({
        id: record.id,
        tag_id: tagId,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        note: note || null,
      })
    } else {
      await createRecord.mutateAsync({
        tag_id: tagId,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        note: note || null,
      })
    }

    onClose()
  }

  const handleDelete = async () => {
    if (!record) return
    if (!window.confirm('この記録を削除しますか？')) return

    await deleteRecord.mutateAsync(record.id)
    onClose()
  }

  const isPending =
    createRecord.isPending || updateRecord.isPending || deleteRecord.isPending

  return (
    <Dialog open={open} onOpenChange={() => !isPending && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? '記録を編集' : '記録を追加'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">タグ</label>
            <TagSelector value={tagId} onChange={setTagId} />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">開始時間</label>
            <Input
              type="datetime-local"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">終了時間</label>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">メモ（任意）</label>
            <Input
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="メモを入力..."
            />
          </div>

          <DialogFooter className="gap-2">
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
              >
                削除
              </Button>
            )}
            <div className="flex-1" />
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={!tagId || !startTime || !endTime || isPending}
            >
              {isEditing ? '保存' : '追加'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

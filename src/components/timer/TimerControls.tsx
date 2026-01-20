import { Play, Square, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTimerStore } from '@/stores/timerStore'
import { useCreateRecord } from '@/hooks/useRecords'

interface TimerControlsProps {
  selectedTagId: string | null
}

export function TimerControls({ selectedTagId }: TimerControlsProps) {
  const { isRunning, start, stop, discard } = useTimerStore()
  const createRecord = useCreateRecord()

  const handleStart = () => {
    if (!selectedTagId) return
    start(selectedTagId)
  }

  const handleStop = async () => {
    const result = stop()
    if (result) {
      await createRecord.mutateAsync({
        start_time: result.startTime,
        end_time: result.endTime,
        tag_id: result.tagId,
      })
    }
  }

  const handleDiscard = () => {
    if (window.confirm('計測中の記録を破棄しますか？')) {
      discard()
    }
  }

  if (isRunning) {
    return (
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={handleDiscard}
          className="gap-2"
        >
          <Trash2 className="w-5 h-5" />
          破棄
        </Button>
        <Button
          size="lg"
          onClick={handleStop}
          disabled={createRecord.isPending}
          className="gap-2 bg-destructive hover:bg-destructive/90"
        >
          <Square className="w-5 h-5" />
          停止
        </Button>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <Button
        size="lg"
        onClick={handleStart}
        disabled={!selectedTagId}
        className="gap-2 px-8"
      >
        <Play className="w-5 h-5" />
        開始
      </Button>
    </div>
  )
}

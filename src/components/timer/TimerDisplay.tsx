import { useState, useEffect } from 'react'
import { useTimerStore } from '@/stores/timerStore'

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return [hours, minutes, secs]
    .map(v => v.toString().padStart(2, '0'))
    .join(':')
}

export function TimerDisplay() {
  const { isRunning, startTime } = useTimerStore()
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!isRunning || !startTime) {
      setElapsed(0)
      return
    }

    // 初期値を計算
    const start = new Date(startTime).getTime()
    setElapsed(Math.floor((Date.now() - start) / 1000))

    // 1秒ごとに更新
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, startTime])

  return (
    <div className="text-center py-4">
      <div
        className={`text-5xl font-bold font-mono tabular-nums transition-colors ${
          isRunning ? 'text-primary' : 'text-foreground'
        }`}
      >
        {formatTime(elapsed)}
      </div>
      {isRunning && (
        <div className="mt-2 text-sm text-muted-foreground">計測中...</div>
      )}
    </div>
  )
}

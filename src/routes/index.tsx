import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { TimerControls } from '@/components/timer/TimerControls'
import { TagSelector } from '@/components/tags/TagSelector'
import { TodayRecordsList } from '@/components/records/TodayRecordsList'
import { useTimerStore } from '@/stores/timerStore'

export function HomePage() {
  const { selectedTagId, setSelectedTagId, isRunning } = useTimerStore()

  return (
    <div className="space-y-6">
      {/* Timer Section */}
      <section className="py-4">
        <TimerDisplay />

        <div className="mb-6">
          <TagSelector
            value={selectedTagId}
            onChange={setSelectedTagId}
            disabled={isRunning}
          />
        </div>

        <TimerControls selectedTagId={selectedTagId} />
      </section>

      {/* Divider */}
      <hr className="border-border" />

      {/* Today's Records */}
      <TodayRecordsList />
    </div>
  )
}

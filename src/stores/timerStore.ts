import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TimerState {
  isRunning: boolean
  startTime: string | null
  selectedTagId: string | null
}

interface TimerActions {
  start: (tagId: string) => void
  stop: () => { startTime: string; endTime: string; tagId: string } | null
  discard: () => void
  setSelectedTagId: (tagId: string | null) => void
}

type TimerStore = TimerState & TimerActions

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      isRunning: false,
      startTime: null,
      selectedTagId: null,

      start: (tagId: string) => {
        set({
          isRunning: true,
          startTime: new Date().toISOString(),
          selectedTagId: tagId,
        })
      },

      stop: () => {
        const { startTime, selectedTagId } = get()
        if (!startTime || !selectedTagId) return null

        const result = {
          startTime,
          endTime: new Date().toISOString(),
          tagId: selectedTagId,
        }

        set({
          isRunning: false,
          startTime: null,
        })

        return result
      },

      discard: () => {
        set({
          isRunning: false,
          startTime: null,
        })
      },

      setSelectedTagId: (tagId: string | null) => {
        set({ selectedTagId: tagId })
      },
    }),
    {
      name: 'timer-storage',
    }
  )
)

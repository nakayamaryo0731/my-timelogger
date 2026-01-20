import { describe, it, expect, beforeEach } from 'vitest'
import { useTimerStore } from './timerStore'

describe('timerStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useTimerStore.setState({
      isRunning: false,
      startTime: null,
      selectedTagId: null,
    })
  })

  it('should start timer with tag id', () => {
    const store = useTimerStore.getState()
    store.start('tag-123')

    const state = useTimerStore.getState()
    expect(state.isRunning).toBe(true)
    expect(state.startTime).toBeTruthy()
    expect(state.selectedTagId).toBe('tag-123')
  })

  it('should stop timer and return result', () => {
    const store = useTimerStore.getState()
    store.start('tag-123')

    const result = useTimerStore.getState().stop()

    expect(result).toBeTruthy()
    expect(result?.tagId).toBe('tag-123')
    expect(result?.startTime).toBeTruthy()
    expect(result?.endTime).toBeTruthy()

    const state = useTimerStore.getState()
    expect(state.isRunning).toBe(false)
    expect(state.startTime).toBeNull()
  })

  it('should return null when stopping without start', () => {
    const result = useTimerStore.getState().stop()
    expect(result).toBeNull()
  })

  it('should discard timer', () => {
    const store = useTimerStore.getState()
    store.start('tag-123')
    store.discard()

    const state = useTimerStore.getState()
    expect(state.isRunning).toBe(false)
    expect(state.startTime).toBeNull()
    expect(state.selectedTagId).toBe('tag-123') // Tag should remain selected
  })

  it('should set selected tag id', () => {
    const store = useTimerStore.getState()
    store.setSelectedTagId('new-tag')

    expect(useTimerStore.getState().selectedTagId).toBe('new-tag')
  })

  it('should clear selected tag id', () => {
    const store = useTimerStore.getState()
    store.setSelectedTagId('tag-123')
    store.setSelectedTagId(null)

    expect(useTimerStore.getState().selectedTagId).toBeNull()
  })
})

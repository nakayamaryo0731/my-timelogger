import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { TimerDisplay } from './TimerDisplay'
import { useTimerStore } from '@/stores/timerStore'

describe('TimerDisplay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useTimerStore.setState({
      isRunning: false,
      startTime: null,
      selectedTagId: null,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should display 00:00:00 when timer is not running', () => {
    render(<TimerDisplay />)
    expect(screen.getByText('00:00:00')).toBeInTheDocument()
  })

  it('should display elapsed time when timer is running', () => {
    const now = new Date('2024-01-01T12:00:00Z')
    vi.setSystemTime(now)

    // Start timer 1 minute ago
    const startTime = new Date('2024-01-01T11:59:00Z').toISOString()
    useTimerStore.setState({
      isRunning: true,
      startTime,
      selectedTagId: 'tag-1',
    })

    render(<TimerDisplay />)
    expect(screen.getByText('00:01:00')).toBeInTheDocument()
  })

  it('should update display as time passes', async () => {
    const now = new Date('2024-01-01T12:00:00Z')
    vi.setSystemTime(now)

    const startTime = now.toISOString()
    useTimerStore.setState({
      isRunning: true,
      startTime,
      selectedTagId: 'tag-1',
    })

    render(<TimerDisplay />)
    expect(screen.getByText('00:00:00')).toBeInTheDocument()

    // Advance time by 5 seconds with act()
    await act(async () => {
      vi.advanceTimersByTime(5000)
    })

    // Check if display updated
    expect(screen.getByText('00:00:05')).toBeInTheDocument()
  })
})

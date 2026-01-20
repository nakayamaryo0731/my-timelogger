import { describe, it, expect } from 'vitest'
import { formatDuration, calculateTotalDuration } from './useRecords'
import type { Record } from '@/types'

describe('formatDuration', () => {
  it('should format seconds to minutes only when under an hour', () => {
    expect(formatDuration(0)).toBe('0m')
    expect(formatDuration(60)).toBe('1m')
    expect(formatDuration(120)).toBe('2m')
    expect(formatDuration(3599)).toBe('59m')
  })

  it('should format seconds to hours and minutes when over an hour', () => {
    expect(formatDuration(3600)).toBe('1h 0m')
    expect(formatDuration(3660)).toBe('1h 1m')
    expect(formatDuration(7200)).toBe('2h 0m')
    expect(formatDuration(7260)).toBe('2h 1m')
    expect(formatDuration(86400)).toBe('24h 0m')
  })
})

describe('calculateTotalDuration', () => {
  it('should return 0 for empty array', () => {
    expect(calculateTotalDuration([])).toBe(0)
  })

  it('should sum up all durations', () => {
    const records: Record[] = [
      { id: '1', tag_id: 't1', start_time: '', end_time: null, duration: 3600, note: null, created_at: '', updated_at: '' },
      { id: '2', tag_id: 't1', start_time: '', end_time: null, duration: 1800, note: null, created_at: '', updated_at: '' },
      { id: '3', tag_id: 't2', start_time: '', end_time: null, duration: 900, note: null, created_at: '', updated_at: '' },
    ]
    expect(calculateTotalDuration(records)).toBe(6300)
  })

  it('should handle null durations', () => {
    const records: Record[] = [
      { id: '1', tag_id: 't1', start_time: '', end_time: null, duration: 3600, note: null, created_at: '', updated_at: '' },
      { id: '2', tag_id: 't1', start_time: '', end_time: null, duration: null, note: null, created_at: '', updated_at: '' },
    ]
    expect(calculateTotalDuration(records)).toBe(3600)
  })
})

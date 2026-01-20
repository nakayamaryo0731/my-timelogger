export interface Tag {
  id: string
  name: string
  parent_id: string | null
  color: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Record {
  id: string
  start_time: string
  end_time: string | null
  duration: number | null
  tag_id: string
  note: string | null
  created_at: string
  updated_at: string
}

export interface TimerState {
  isRunning: boolean
  startTime: string | null
  selectedTagId: string | null
}

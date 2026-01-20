// Supabase データベース型
export type {
  Database,
  Tag,
  TagInsert,
  TagUpdate,
  Record,
  RecordInsert,
  RecordUpdate,
} from './database'

// クライアント側の型
export interface TimerState {
  isRunning: boolean
  startTime: string | null
  selectedTagId: string | null
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Record, RecordInsert, RecordUpdate } from '@/types'

const RECORDS_KEY = ['records']

// 日付の開始・終了時刻を取得（ローカルタイムゾーン）
function getDayRange(date: Date) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)

  const end = new Date(date)
  end.setHours(23, 59, 59, 999)

  return { start: start.toISOString(), end: end.toISOString() }
}

// 今日の記録を取得
export function useTodayRecords() {
  const today = new Date()
  const { start, end } = getDayRange(today)

  return useQuery({
    queryKey: [...RECORDS_KEY, 'today'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('records')
        .select('*')
        .gte('start_time', start)
        .lte('start_time', end)
        .order('start_time', { ascending: false })

      if (error) throw error
      return data as Record[]
    },
  })
}

// 指定日の記録を取得
export function useRecordsByDate(date: Date) {
  const { start, end } = getDayRange(date)

  return useQuery({
    queryKey: [...RECORDS_KEY, 'date', date.toISOString().split('T')[0]],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('records')
        .select('*')
        .gte('start_time', start)
        .lte('start_time', end)
        .order('start_time', { ascending: false })

      if (error) throw error
      return data as Record[]
    },
  })
}

// 期間指定で記録を取得（startDate が null の場合は全期間）
export function useRecordsByPeriod(startDate: Date | null, endDate: Date) {
  const end = getDayRange(endDate).end

  return useQuery({
    queryKey: [
      ...RECORDS_KEY,
      'period',
      startDate?.toISOString().split('T')[0] ?? 'all',
      endDate.toISOString().split('T')[0],
    ],
    queryFn: async () => {
      let query = supabase
        .from('records')
        .select('*')
        .lte('start_time', end)
        .order('start_time', { ascending: false })

      if (startDate) {
        const start = getDayRange(startDate).start
        query = query.gte('start_time', start)
      }

      const { data, error } = await query

      if (error) throw error
      return data as Record[]
    },
  })
}

// 記録作成
export function useCreateRecord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (record: RecordInsert) => {
      // duration を計算
      let duration: number | null = null
      if (record.end_time && record.start_time) {
        duration = Math.floor(
          (new Date(record.end_time).getTime() -
            new Date(record.start_time).getTime()) /
            1000
        )
      }

      const { data, error } = await supabase
        .from('records')
        .insert({ ...record, duration })
        .select()
        .single()

      if (error) throw error
      return data as Record
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECORDS_KEY })
    },
  })
}

// 記録更新
export function useUpdateRecord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: RecordUpdate & { id: string }) => {
      // duration を再計算（end_time または start_time が更新された場合）
      let duration = updates.duration
      if (updates.end_time !== undefined || updates.start_time !== undefined) {
        // 既存のレコードを取得して duration を計算
        const { data: existing } = await supabase
          .from('records')
          .select('start_time, end_time')
          .eq('id', id)
          .single()

        if (existing) {
          const startTime = updates.start_time ?? existing.start_time
          const endTime = updates.end_time ?? existing.end_time

          if (endTime && startTime) {
            duration = Math.floor(
              (new Date(endTime).getTime() - new Date(startTime).getTime()) /
                1000
            )
          }
        }
      }

      const { data, error } = await supabase
        .from('records')
        .update({ ...updates, duration })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Record
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECORDS_KEY })
    },
  })
}

// 記録削除
export function useDeleteRecord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('records')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECORDS_KEY })
    },
  })
}

// 合計時間を計算するユーティリティ（秒）
export function calculateTotalDuration(records: Record[]): number {
  return records.reduce((total, record) => total + (record.duration ?? 0), 0)
}

// 秒を「Xh Ym」形式にフォーマット
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

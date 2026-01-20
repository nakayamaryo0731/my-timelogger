import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Tag, TagInsert, TagUpdate } from '@/types'

const TAGS_KEY = ['tags']

// タグ一覧取得
export function useTags() {
  return useQuery({
    queryKey: TAGS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('sort_order')
        .order('created_at')

      if (error) throw error
      return data as Tag[]
    },
  })
}

// タグ作成
export function useCreateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (tag: TagInsert) => {
      const { data, error } = await supabase
        .from('tags')
        .insert(tag)
        .select()
        .single()

      if (error) throw error
      return data as Tag
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAGS_KEY })
    },
  })
}

// タグ更新
export function useUpdateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: TagUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('tags')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Tag
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAGS_KEY })
    },
  })
}

// タグ削除
export function useDeleteTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAGS_KEY })
    },
  })
}

// 階層構造でタグを取得するユーティリティ
export function buildTagTree(tags: Tag[]): (Tag & { children: Tag[] })[] {
  const tagMap = new Map<string, Tag & { children: Tag[] }>()
  const roots: (Tag & { children: Tag[] })[] = []

  // 全タグをマップに追加
  tags.forEach(tag => {
    tagMap.set(tag.id, { ...tag, children: [] })
  })

  // 親子関係を構築
  tags.forEach(tag => {
    const node = tagMap.get(tag.id)!
    if (tag.parent_id && tagMap.has(tag.parent_id)) {
      tagMap.get(tag.parent_id)!.children.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}

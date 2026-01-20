import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTags, buildTagTree } from '@/hooks/useTags'
import type { Tag } from '@/types'

interface TagSelectorProps {
  value: string | null
  onChange: (tagId: string | null) => void
  disabled?: boolean
}

// 階層構造をフラットなリストに変換（インデント付き）
function flattenTags(
  tags: (Tag & { children: Tag[] })[],
  depth = 0
): { tag: Tag; depth: number }[] {
  const result: { tag: Tag; depth: number }[] = []

  for (const tag of tags) {
    result.push({ tag, depth })
    if ('children' in tag && tag.children.length > 0) {
      result.push(
        ...flattenTags(tag.children as (Tag & { children: Tag[] })[], depth + 1)
      )
    }
  }

  return result
}

export function TagSelector({ value, onChange, disabled }: TagSelectorProps) {
  const { data: tags, isLoading } = useTags()

  if (isLoading) {
    return (
      <div className="h-10 bg-secondary rounded-lg animate-pulse" />
    )
  }

  const tagTree = tags ? buildTagTree(tags) : []
  const flatTags = flattenTags(tagTree)

  // 選択中のタグ名を取得
  const selectedTag = tags?.find(t => t.id === value)

  return (
    <Select
      value={value ?? undefined}
      onValueChange={v => onChange(v || null)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="タグを選択">
          {selectedTag && (
            <span className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedTag.color }}
              />
              {selectedTag.name}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {flatTags.length === 0 ? (
          <div className="px-2 py-4 text-sm text-muted-foreground text-center">
            タグがありません
            <br />
            タグ画面で作成してください
          </div>
        ) : (
          flatTags.map(({ tag, depth }) => (
            <SelectItem key={tag.id} value={tag.id}>
              <span className="flex items-center gap-2">
                <span style={{ width: depth * 16 }} />
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tag.color }}
                />
                <span>{tag.name}</span>
              </span>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}

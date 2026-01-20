import { ChevronRight, ChevronDown, Check } from 'lucide-react'
import { useState } from 'react'
import { useTags, buildTagTree } from '@/hooks/useTags'
import { getTagDisplayColor } from '@/lib/color'
import type { Tag } from '@/types'
import { cn } from '@/lib/utils'

interface TagSelectorProps {
  value: string | null
  onChange: (tagId: string | null) => void
  disabled?: boolean
}

interface TagNodeProps {
  tag: Tag & { children: (Tag & { children: Tag[] })[] }
  depth: number
  selectedId: string | null
  onSelect: (tagId: string) => void
  disabled: boolean
  isLast: boolean
  allTags: Tag[]
}

function TagNode({
  tag,
  depth,
  selectedId,
  onSelect,
  disabled,
  isLast,
  allTags,
}: TagNodeProps) {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = tag.children.length > 0
  const isSelected = selectedId === tag.id
  const displayColor = getTagDisplayColor(tag, allTags)

  return (
    <div className="select-none">
      <div
        className={cn(
          'flex items-center gap-1 py-1.5 px-2 rounded cursor-pointer',
          isSelected
            ? 'bg-primary/20 text-primary'
            : 'hover:bg-accent/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => !disabled && onSelect(tag.id)}
      >
        {/* インデント + ツリーライン */}
        {depth > 0 && (
          <div
            className="flex items-center"
            style={{ width: (depth - 1) * 20 }}
          >
            {Array.from({ length: depth - 1 }).map((_, i) => (
              <div key={i} className="w-5 h-full flex justify-center">
                <div className="w-px bg-border h-full" />
              </div>
            ))}
          </div>
        )}

        {depth > 0 && (
          <div className="w-5 flex items-center justify-center text-border">
            {isLast ? '└' : '├'}
          </div>
        )}

        {/* 展開/折りたたみ */}
        {hasChildren ? (
          <button
            className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground"
            onClick={e => {
              e.stopPropagation()
              setExpanded(!expanded)
            }}
            disabled={disabled}
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}

        {/* 色 */}
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: displayColor }}
        />

        {/* 名前 */}
        <span className="text-sm flex-1">{tag.name}</span>

        {/* 選択マーク */}
        {isSelected && <Check className="w-4 h-4 text-primary" />}
      </div>

      {/* 子タグ */}
      {hasChildren && expanded && (
        <div>
          {tag.children.map((child, index) => (
            <TagNode
              key={child.id}
              tag={child as Tag & { children: (Tag & { children: Tag[] })[] }}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              disabled={disabled}
              isLast={index === tag.children.length - 1}
              allTags={allTags}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function TagSelector({ value, onChange, disabled = false }: TagSelectorProps) {
  const { data: tags, isLoading } = useTags()

  if (isLoading) {
    return (
      <div className="border rounded-lg p-2 bg-card space-y-1">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-7 bg-muted rounded animate-pulse" />
        ))}
      </div>
    )
  }

  const tagTree = tags ? buildTagTree(tags) : []

  if (tagTree.length === 0) {
    return (
      <div className="border rounded-lg p-4 bg-card text-center text-sm text-muted-foreground">
        タグがありません
        <br />
        タグ画面で作成してください
      </div>
    )
  }

  const handleSelect = (tagId: string) => {
    // 同じタグをクリックしたら選択解除
    onChange(value === tagId ? null : tagId)
  }

  return (
    <div className="border rounded-lg p-2 bg-card">
      {tagTree.map((tag, index) => (
        <TagNode
          key={tag.id}
          tag={tag as Tag & { children: (Tag & { children: Tag[] })[] }}
          depth={0}
          selectedId={value}
          onSelect={handleSelect}
          disabled={disabled}
          isLast={index === tagTree.length - 1}
          allTags={tags ?? []}
        />
      ))}
    </div>
  )
}

import { ChevronRight, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useTags, buildTagTree } from '@/hooks/useTags'
import type { Tag } from '@/types'

interface TagTreeViewProps {
  onEdit: (tag: Tag) => void
}

interface TagNodeProps {
  tag: Tag & { children: (Tag & { children: Tag[] })[] }
  depth: number
  onEdit: (tag: Tag) => void
  isLast: boolean
}

function TagNode({ tag, depth, onEdit, isLast }: TagNodeProps) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = tag.children.length > 0

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-1 py-1 px-2 rounded hover:bg-accent/50 cursor-pointer group"
        onClick={() => onEdit(tag)}
      >
        {/* インデント + ツリーライン */}
        {depth > 0 && (
          <div className="flex items-center" style={{ width: (depth - 1) * 20 }}>
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
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: tag.color }}
        />

        {/* 名前 */}
        <span className="text-sm">{tag.name}</span>
      </div>

      {/* 子タグ */}
      {hasChildren && expanded && (
        <div>
          {tag.children.map((child, index) => (
            <TagNode
              key={child.id}
              tag={child as Tag & { children: (Tag & { children: Tag[] })[] }}
              depth={depth + 1}
              onEdit={onEdit}
              isLast={index === tag.children.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function TagTreeView({ onEdit }: TagTreeViewProps) {
  const { data: tags, isLoading } = useTags()

  if (isLoading) {
    return (
      <div className="space-y-1 p-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-6 bg-muted rounded animate-pulse" />
        ))}
      </div>
    )
  }

  const tagTree = tags ? buildTagTree(tags) : []

  if (tagTree.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        タグがありません
        <br />
        「+」ボタンから作成してください
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-2 bg-card">
      {tagTree.map((tag, index) => (
        <TagNode
          key={tag.id}
          tag={tag as Tag & { children: (Tag & { children: Tag[] })[] }}
          depth={0}
          onEdit={onEdit}
          isLast={index === tagTree.length - 1}
        />
      ))}
    </div>
  )
}

import { ChevronRight, Pencil } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTags, buildTagTree } from '@/hooks/useTags'
import type { Tag } from '@/types'

interface TagTreeViewProps {
  onEdit: (tag: Tag) => void
}

interface TagNodeProps {
  tag: Tag & { children: (Tag & { children: Tag[] })[] }
  depth: number
  onEdit: (tag: Tag) => void
}

function TagNode({ tag, depth, onEdit }: TagNodeProps) {
  const hasChildren = tag.children.length > 0

  return (
    <div>
      <Card
        className="p-3 flex items-center gap-2 cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => onEdit(tag)}
      >
        <div style={{ width: depth * 20 }} />

        {hasChildren ? (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        ) : (
          <div className="w-4" />
        )}

        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: tag.color }}
        />

        <span className="flex-1 font-medium">{tag.name}</span>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={e => {
            e.stopPropagation()
            onEdit(tag)
          }}
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </Card>

      {hasChildren && (
        <div className="mt-2 space-y-2">
          {tag.children.map(child => (
            <TagNode
              key={child.id}
              tag={child as Tag & { children: (Tag & { children: Tag[] })[] }}
              depth={depth + 1}
              onEdit={onEdit}
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
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-12 bg-card rounded-lg animate-pulse" />
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
    <div className="space-y-2">
      {tagTree.map(tag => (
        <TagNode
          key={tag.id}
          tag={tag as Tag & { children: (Tag & { children: Tag[] })[] }}
          depth={0}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}

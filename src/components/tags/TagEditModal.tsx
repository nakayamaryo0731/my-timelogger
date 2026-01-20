import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from '@/hooks/useTags'
import { deriveChildColor } from '@/lib/color'
import type { Tag } from '@/types'

const COLORS = [
  '#06b6d4', // cyan
  '#22c55e', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#f97316', // orange
  '#3b82f6', // blue
]

interface TagEditModalProps {
  open: boolean
  onClose: () => void
  tag?: Tag | null // null = 新規作成
  defaultParentId?: string | null
}

export function TagEditModal({
  open,
  onClose,
  tag,
  defaultParentId,
}: TagEditModalProps) {
  const { data: tags } = useTags()
  const createTag = useCreateTag()
  const updateTag = useUpdateTag()
  const deleteTag = useDeleteTag()

  const [name, setName] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [parentId, setParentId] = useState<string | null>(null)

  const isEditing = !!tag

  // 未使用の色を取得
  const getUnusedColor = () => {
    if (!tags) return COLORS[0]
    // 親タグ（ルートタグ）で使用されている色を取得
    const usedColors = new Set(
      tags.filter(t => !t.parent_id).map(t => t.color)
    )
    // 未使用の色を探す
    const unusedColor = COLORS.find(c => !usedColors.has(c))
    return unusedColor ?? COLORS[0]
  }

  // 親タグの色から継承色をプレビュー
  const getPreviewColor = () => {
    if (!parentId || !tags) return COLORS[0]
    const parent = tags.find(t => t.id === parentId)
    if (!parent) return COLORS[0]

    // 同じ親を持つ既存の兄弟タグの数を数える（新規作成時のインデックス）
    const siblings = tags.filter(t => t.parent_id === parentId && t.id !== tag?.id)
    const index = siblings.length

    return deriveChildColor(parent.color, index)
  }

  // 初期値を設定
  useEffect(() => {
    if (tag) {
      setName(tag.name)
      setColor(tag.color)
      setParentId(tag.parent_id)
    } else {
      setName('')
      setColor(getUnusedColor())
      setParentId(defaultParentId ?? null)
    }
  }, [tag, defaultParentId, open, tags])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    // 親タグがある場合は継承色を使用
    const finalColor = parentId ? getPreviewColor() : color

    if (isEditing && tag) {
      await updateTag.mutateAsync({
        id: tag.id,
        name: name.trim(),
        color: finalColor,
        parent_id: parentId,
      })
    } else {
      await createTag.mutateAsync({
        name: name.trim(),
        color: finalColor,
        parent_id: parentId,
      })
    }

    onClose()
  }

  const handleDelete = async () => {
    if (!tag) return
    if (!window.confirm(`「${tag.name}」を削除しますか？\n関連する記録も削除されます。`)) {
      return
    }

    await deleteTag.mutateAsync(tag.id)
    onClose()
  }

  // 自分自身と子孫は親として選択不可
  const availableParents = tags?.filter(t => {
    if (!tag) return true
    if (t.id === tag.id) return false
    // 子孫チェック（簡易版：直接の子のみ）
    let current = t
    while (current.parent_id) {
      if (current.parent_id === tag.id) return false
      current = tags.find(p => p.id === current.parent_id) || current
      if (current.parent_id === current.id) break // 循環防止
    }
    return true
  })

  const isPending = createTag.isPending || updateTag.isPending || deleteTag.isPending

  return (
    <Dialog open={open} onOpenChange={() => !isPending && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'タグを編集' : '新しいタグ'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">タグ名</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例: 英語学習"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">親タグ</label>
            <Select
              value={parentId ?? 'none'}
              onValueChange={v => setParentId(v === 'none' ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="なし" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">なし（ルート）</SelectItem>
                {availableParents?.map(t => (
                  <SelectItem key={t.id} value={t.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: t.color }}
                      />
                      {t.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* カラー選択：親タグがない場合のみ表示 */}
          {!parentId ? (
            <div>
              <label className="text-sm font-medium mb-2 block">カラー</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`w-8 h-8 rounded-full transition-transform ${
                      color === c ? 'ring-2 ring-offset-2 ring-offset-background ring-primary scale-110' : ''
                    }`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium mb-2 block">カラー</label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: getPreviewColor() }}
                />
                <span>親タグの色を継承</span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
              >
                削除
              </Button>
            )}
            <div className="flex-1" />
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={!name.trim() || isPending}>
              {isEditing ? '保存' : '作成'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

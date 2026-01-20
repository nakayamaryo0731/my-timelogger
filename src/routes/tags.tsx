import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TagTreeView } from '@/components/tags/TagTreeView'
import { TagEditModal } from '@/components/tags/TagEditModal'
import type { Tag } from '@/types'

export function TagsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)

  const handleCreate = () => {
    setEditingTag(null)
    setModalOpen(true)
  }

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditingTag(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">タグ管理</h2>
        <Button size="icon" onClick={handleCreate}>
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <TagTreeView onEdit={handleEdit} />

      <TagEditModal
        open={modalOpen}
        onClose={handleClose}
        tag={editingTag}
      />
    </div>
  )
}

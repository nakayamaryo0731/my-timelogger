import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DateNavigationProps {
  date: Date
  onChange: (date: Date) => void
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]

  return `${year}年${month}月${day}日 (${weekday})`
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function DateNavigation({ date, onChange }: DateNavigationProps) {
  const today = new Date()
  const isToday = isSameDay(date, today)

  const goToPrev = () => {
    const prev = new Date(date)
    prev.setDate(prev.getDate() - 1)
    onChange(prev)
  }

  const goToNext = () => {
    const next = new Date(date)
    next.setDate(next.getDate() + 1)
    onChange(next)
  }

  const goToToday = () => {
    onChange(new Date())
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <Button variant="ghost" size="icon" onClick={goToPrev}>
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <button
        className="flex-1 text-center font-medium py-2 hover:bg-accent rounded-lg transition-colors"
        onClick={goToToday}
      >
        {formatDate(date)}
        {isToday && (
          <span className="ml-2 text-xs text-primary">(今日)</span>
        )}
      </button>

      <Button
        variant="ghost"
        size="icon"
        onClick={goToNext}
        disabled={isToday}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  )
}

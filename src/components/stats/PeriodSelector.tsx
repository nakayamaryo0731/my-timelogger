import { Button } from '@/components/ui/button'

export type Period = '1w' | '1m' | '3m'

interface PeriodSelectorProps {
  value: Period
  onChange: (period: Period) => void
}

const periods: { value: Period; label: string }[] = [
  { value: '1w', label: '1週間' },
  { value: '1m', label: '1ヶ月' },
  { value: '3m', label: '3ヶ月' },
]

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex gap-2">
      {periods.map(period => (
        <Button
          key={period.value}
          variant={value === period.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(period.value)}
        >
          {period.label}
        </Button>
      ))}
    </div>
  )
}

export function getPeriodDateRange(period: Period): { start: Date; end: Date } {
  const end = new Date()
  end.setHours(23, 59, 59, 999)

  const start = new Date()
  start.setHours(0, 0, 0, 0)

  switch (period) {
    case '1w':
      start.setDate(start.getDate() - 6)
      break
    case '1m':
      start.setDate(start.getDate() - 29)
      break
    case '3m':
      start.setDate(start.getDate() - 89)
      break
  }

  return { start, end }
}

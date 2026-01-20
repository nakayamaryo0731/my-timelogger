import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PeriodSelector,
  getPeriodDateRange,
  type Period,
} from '@/components/stats/PeriodSelector'
import { TagBreakdownChart } from '@/components/stats/TagBreakdownChart'
import { DailyTrendChart } from '@/components/stats/DailyTrendChart'
import { useRecordsByPeriod } from '@/hooks/useRecords'

export function StatsPage() {
  const [period, setPeriod] = useState<Period>('1w')

  const { start, end } = getPeriodDateRange(period)
  const { data: records, isLoading } = useRecordsByPeriod(start, end)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">統計</h2>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          読み込み中...
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">タグ別内訳</CardTitle>
            </CardHeader>
            <CardContent>
              <TagBreakdownChart records={records ?? []} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">日別推移</CardTitle>
            </CardHeader>
            <CardContent>
              <DailyTrendChart records={records ?? []} period={period} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

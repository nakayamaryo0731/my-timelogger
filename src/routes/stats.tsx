import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TagBreakdownChart } from '@/components/stats/TagBreakdownChart'
import { DailyTrendChart } from '@/components/stats/DailyTrendChart'
import { useRecordsByPeriod } from '@/hooks/useRecords'

export function StatsPage() {
  const { data: records, isLoading } = useRecordsByPeriod(null, new Date())

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">統計</h2>

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
              <CardTitle className="text-base">累計推移</CardTitle>
            </CardHeader>
            <CardContent>
              <DailyTrendChart records={records ?? []} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

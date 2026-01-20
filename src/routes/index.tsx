export function HomePage() {
  return (
    <div className="space-y-6">
      {/* Timer Section */}
      <section className="text-center py-8">
        <div className="text-5xl font-bold font-mono mb-6">00:00:00</div>
        <div className="mb-6">
          <button className="px-4 py-2 bg-secondary rounded-lg text-sm">
            タグを選択
          </button>
        </div>
        <div className="flex justify-center gap-4">
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium">
            開始
          </button>
        </div>
      </section>

      {/* Today's Records */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">今日の記録</h2>
          <span className="text-sm text-muted-foreground">計 0h 0m</span>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          まだ記録がありません
        </div>
      </section>
    </div>
  )
}

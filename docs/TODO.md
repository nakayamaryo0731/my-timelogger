# My Time Logger 実装 TODO

## 進捗サマリー

| フェーズ | 進捗 |
|----------|------|
| 1. プロジェクトセットアップ | 0/6 |
| 2. Supabase設定 | 0/5 |
| 3. 共通基盤 | 0/8 |
| 4. ホーム画面 | 0/7 |
| 5. 記録一覧画面 | 0/5 |
| 6. 統計画面 | 0/5 |
| 7. タグ管理画面 | 0/5 |
| 8. PWA対応 | 0/4 |
| 9. テスト | 0/4 |
| 10. デプロイ | 0/4 |

---

## 1. プロジェクトセットアップ

- [ ] Vite + React + TypeScript プロジェクト作成
- [ ] TailwindCSS 導入・設定
- [ ] shadcn/ui 導入・ダークテーマ設定
- [ ] React Router 導入・ルーティング設定
- [ ] TanStack Query 導入
- [ ] Zustand 導入

## 2. Supabase設定

- [ ] Supabaseプロジェクト作成
- [ ] tags テーブル作成
- [ ] records テーブル作成
- [ ] RLS（Row Level Security）設定（認証なしのため無効化）
- [ ] Supabaseクライアント設定（src/lib/supabase.ts）

## 3. 共通基盤

- [ ] 型定義（src/types/）
  - [ ] Tag 型
  - [ ] Record 型
- [ ] 共通UIコンポーネント（shadcn/ui から必要なものを追加）
  - [ ] Button
  - [ ] Card
  - [ ] Dialog / Modal
  - [ ] Select / Dropdown
  - [ ] Input
  - [ ] DateTimePicker
- [ ] 共通レイアウト
  - [ ] AppShell（Header + Main + BottomNav）
  - [ ] BottomNavigation
- [ ] カスタムフック
  - [ ] useTags（タグCRUD）
  - [ ] useRecords（記録CRUD）

## 4. ホーム画面（タイマー機能）

- [ ] TimerDisplay コンポーネント（経過時間表示）
- [ ] TagSelector コンポーネント（階層タグ選択）
- [ ] TimerControls コンポーネント（開始/停止/破棄ボタン）
- [ ] タイマー状態管理（Zustand store）
- [ ] タイマー状態の永続化（localStorage）
- [ ] TodayRecordsList コンポーネント（今日の記録一覧）
- [ ] ホーム画面の統合（src/routes/index.tsx）

## 5. 記録一覧画面

- [ ] 日付ナビゲーション コンポーネント
- [ ] RecordCard コンポーネント（記録表示カード）
- [ ] RecordEditModal コンポーネント（記録編集モーダル）
- [ ] 手動記録追加機能
- [ ] 記録一覧画面の統合（src/routes/history.tsx）

## 6. 統計画面

- [ ] PeriodSelector コンポーネント（期間選択）
- [ ] TagFilter コンポーネント（タグフィルター）
- [ ] TagBreakdownChart コンポーネント（円グラフ / Recharts）
- [ ] DailyTrendChart コンポーネント（棒グラフ / Recharts）
- [ ] 統計画面の統合（src/routes/stats.tsx）

## 7. タグ管理画面

- [ ] TagTreeView コンポーネント（階層タグ一覧）
- [ ] TagEditModal コンポーネント（タグ編集モーダル）
- [ ] タグ作成機能（親タグ指定可能）
- [ ] タグ削除機能（関連recordsの扱い確認）
- [ ] タグ管理画面の統合（src/routes/tags.tsx）

## 8. PWA対応

- [ ] vite-plugin-pwa 導入・設定
- [ ] manifest.json 作成
- [ ] PWAアイコン作成（192x192, 512x512, 180x180）
- [ ] Service Worker キャッシュ戦略設定

## 9. テスト

- [ ] Vitest 導入
- [ ] コンポーネントテスト（React Testing Library）
- [ ] カスタムフックテスト
- [ ] E2Eテスト検討（Playwright / 任意）

## 10. デプロイ

- [ ] Vercel プロジェクト作成
- [ ] 環境変数設定（Supabase URL, Key）
- [ ] 本番デプロイ
- [ ] 動作確認（PC / スマホ）

---

## 完了したタスクのアーカイブ

（完了したタスクはここに移動）

---

## メモ・備考

- タスク完了時はチェックを入れ、必要に応じてアーカイブセクションに移動
- 大きなタスクは適宜分割して追加
- 問題が発生した場合はメモを追記

---

最終更新: 2026-01-20

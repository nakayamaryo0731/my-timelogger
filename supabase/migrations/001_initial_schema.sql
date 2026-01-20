-- My Time Logger 初期スキーマ

-- tags テーブル（階層構造対応）
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  parent_id UUID REFERENCES tags(id) ON DELETE SET NULL,
  color VARCHAR(7) NOT NULL DEFAULT '#06b6d4',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- records テーブル（時間記録）
CREATE TABLE records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration INTEGER, -- 秒単位、end_time - start_time から算出
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_tags_parent_id ON tags(parent_id);
CREATE INDEX idx_records_tag_id ON records(tag_id);
CREATE INDEX idx_records_start_time ON records(start_time);

-- updated_at 自動更新用のトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガー設定
CREATE TRIGGER tags_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER records_updated_at
  BEFORE UPDATE ON records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS を無効化（個人利用のため認証なし）
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;

-- 全員がアクセス可能なポリシー
CREATE POLICY "Allow all access to tags" ON tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to records" ON records FOR ALL USING (true) WITH CHECK (true);

-- サンプルデータ（任意）
-- INSERT INTO tags (name, color) VALUES
--   ('英語学習', '#22c55e'),
--   ('開発', '#06b6d4'),
--   ('読書', '#f59e0b');

// HEXをHSLに変換
function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return [h * 360, s * 100, l * 100]
}

// HSLをHEXに変換
function hslToHex(h: number, s: number, l: number): string {
  h = h / 360
  s = s / 100
  l = l / 100

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  let r, g, b
  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * 親タグの色から子タグの色を生成
 * @param parentColor 親タグの色（HEX）
 * @param index 子タグのインデックス（0から）
 * @returns 子タグの色（HEX）
 */
export function deriveChildColor(parentColor: string, index: number): string {
  const [h, s, l] = hexToHsl(parentColor)

  // 明度を変える（暗め・明るめを交互に）
  // インデックスに応じて明度を調整
  const lightnessOffsets = [10, -10, 20, -15, 5, -5, 15, -20]
  const offset = lightnessOffsets[index % lightnessOffsets.length]

  // 明度を調整（20-80の範囲に収める）
  const newL = Math.max(25, Math.min(75, l + offset))

  // 彩度も少し調整
  const saturationOffset = (index % 3 - 1) * 10
  const newS = Math.max(30, Math.min(100, s + saturationOffset))

  return hslToHex(h, newS, newL)
}

/**
 * タグの表示色を取得（親タグがあれば継承色を計算）
 */
export function getTagDisplayColor(
  tag: { id: string; color: string; parent_id: string | null },
  allTags: { id: string; color: string; parent_id: string | null }[]
): string {
  // 親タグがない場合はそのままの色
  if (!tag.parent_id) {
    return tag.color
  }

  // 親タグを探す
  const parent = allTags.find(t => t.id === tag.parent_id)
  if (!parent) {
    return tag.color
  }

  // 親タグの色を取得（親も継承している可能性があるので再帰）
  const parentColor = getTagDisplayColor(parent, allTags)

  // 同じ親を持つ兄弟タグの中でのインデックスを計算
  const siblings = allTags.filter(t => t.parent_id === tag.parent_id)
  const index = siblings.findIndex(t => t.id === tag.id)

  return deriveChildColor(parentColor, index >= 0 ? index : 0)
}

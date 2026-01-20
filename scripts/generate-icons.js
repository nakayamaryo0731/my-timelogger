import { createCanvas } from 'canvas'
import fs from 'fs'
import path from 'path'

const sizes = [
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
]

const publicDir = path.join(process.cwd(), 'public')

for (const { name, size } of sizes) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, size, size)

  // Circle
  const centerX = size / 2
  const centerY = size / 2
  const radius = size * 0.35

  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.strokeStyle = '#22d3ee'
  ctx.lineWidth = size * 0.05
  ctx.stroke()

  // Clock hands
  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(centerX, centerY - radius * 0.6)
  ctx.strokeStyle = '#22d3ee'
  ctx.lineWidth = size * 0.04
  ctx.lineCap = 'round'
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(centerX + radius * 0.4, centerY)
  ctx.stroke()

  // Center dot
  ctx.beginPath()
  ctx.arc(centerX, centerY, size * 0.03, 0, Math.PI * 2)
  ctx.fillStyle = '#22d3ee'
  ctx.fill()

  // Save
  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync(path.join(publicDir, name), buffer)
  console.log(`Generated ${name}`)
}

console.log('All icons generated!')

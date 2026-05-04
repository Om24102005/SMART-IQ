import * as THREE from 'three'

let panelTextureCache = null

/**
 * Generates a photorealistic solar panel cell texture using an offscreen canvas.
 * Creates the dark blue silicon, silver grid lines, and busbars.
 */
export function getSolarPanelTexture() {
  if (panelTextureCache) return panelTextureCache

  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  // Base silicon color (deep iridescent blue)
  ctx.fillStyle = '#0a1a30'
  ctx.fillRect(0, 0, 1024, 1024)

  // Sub-grid (the silicon crystal variations)
  for (let i = 0; i < 2000; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(15, 35, 65, 0.4)' : 'rgba(5, 15, 30, 0.4)'
    ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 8, 8)
  }

  // Draw cells (6x10 grid on a single panel texture)
  const cols = 6
  const rows = 10
  const cellW = 1024 / cols
  const cellH = 1024 / rows

  ctx.strokeStyle = '#a0b0c0' // Silver lines

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const x = c * cellW
      const y = r * cellH

      // Cell border gaps (dark)
      ctx.fillStyle = '#050a12'
      ctx.fillRect(x, y, cellW, cellH)

      // Cell body (blue)
      ctx.fillStyle = '#0c2240'
      const margin = 4
      ctx.fillRect(x + margin, y + margin, cellW - margin * 2, cellH - margin * 2)

      // Micro grid lines (horizontal)
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let l = 0; l < 12; l++) {
        const ly = y + margin + (l / 12) * (cellH - margin * 2)
        ctx.moveTo(x + margin, ly)
        ctx.lineTo(x + cellW - margin, ly)
      }
      ctx.stroke()

      // Main Busbars (thick vertical silver lines)
      ctx.fillStyle = '#c0d0e0'
      const busbars = 4
      for (let b = 1; b <= busbars; b++) {
        const bx = x + margin + (b / (busbars + 1)) * (cellW - margin * 2)
        ctx.fillRect(bx - 2, y + margin, 4, cellH - margin * 2)
      }
      
      // Chamfered corners (typical of monocrystalline cells)
      ctx.fillStyle = '#050a12'
      const cSize = 6
      ctx.beginPath()
      ctx.moveTo(x + margin, y + margin + cSize)
      ctx.lineTo(x + margin + cSize, y + margin)
      ctx.lineTo(x + margin, y + margin)
      ctx.fill()
      
      ctx.beginPath()
      ctx.moveTo(x + cellW - margin, y + margin + cSize)
      ctx.lineTo(x + cellW - margin - cSize, y + margin)
      ctx.lineTo(x + cellW - margin, y + margin)
      ctx.fill()
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.anisotropy = 16
  
  panelTextureCache = texture
  return texture
}

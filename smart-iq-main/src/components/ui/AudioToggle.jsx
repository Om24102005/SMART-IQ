import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AudioToggle() {
  const [active, setActive] = useState(false)
  const ctxRef = useRef(null)
  const nodesRef = useRef([])

  const startAudio = useCallback(() => {
    if (ctxRef.current) return
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    ctxRef.current = ctx

    // Drone chord: A2 + E3 + A3
    const freqs = [110, 164.81, 220]
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = i === 0 ? 'sine' : 'triangle'
      osc.frequency.value = freq
      gain.gain.value = i === 0 ? 0.04 : 0.02
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      nodesRef.current.push({ osc, gain })
    })
  }, [])

  const stopAudio = useCallback(() => {
    nodesRef.current.forEach(({ osc, gain }) => {
      gain.gain.setTargetAtTime(0, ctxRef.current.currentTime, 0.5)
      osc.stop(ctxRef.current.currentTime + 1)
    })
    nodesRef.current = []
    ctxRef.current = null
  }, [])

  const toggle = () => {
    if (!active) startAudio()
    else stopAudio()
    setActive(v => !v)
  }

  return (
    <motion.button
      onClick={toggle}
      data-cursor="hover"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: 'rgba(26,26,24,0.75)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(232,146,52,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'none',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
      whileHover={{ scale: 1.1, borderColor: 'rgba(232,146,52,0.8)' }}
      whileTap={{ scale: 0.95 }}
      title={active ? 'Mute ambient' : 'Enable ambient sound'}
    >
      {/* Wave bars */}
      <div style={{ display: 'flex', gap: 2, alignItems: 'center', height: 20 }}>
        {[1, 1.6, 1, 0.7, 1.3].map((h, i) => (
          <motion.div
            key={i}
            style={{
              width: 3,
              borderRadius: 2,
              background: active ? '#E89234' : 'rgba(232,146,52,0.4)',
              transformOrigin: 'bottom',
            }}
            animate={active ? {
              scaleY: [h, h * 1.5, h * 0.6, h],
              transition: { repeat: Infinity, duration: 0.8 + i * 0.15, ease: 'easeInOut' }
            } : { scaleY: 1 }}
            initial={{ height: 14 * h }}
          />
        ))}
      </div>
    </motion.button>
  )
}

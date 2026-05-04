import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

const timeMarkers = [
  { time: '12 AM', x: 0, label: null },
  { time: '2 AM', x: 13.5, label: null },
  { time: '4 AM', x: 27, label: null },
  {
    time: '5:12 AM',
    x: 35,
    label: 'Cleaning begins',
    icon: 'water',
    highlight: true,
    color: '#1B4F72',
  },
  {
    time: '6:30 AM',
    x: 46,
    label: 'Panels ready',
    icon: 'sun',
    highlight: true,
    color: '#E89234',
  },
  { time: '8 AM', x: 57, label: null },
  { time: '12 PM', x: 70, label: null },
  { time: '6 PM', x: 90, label: null },
]

function WaterDropIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2 Q15 8 15 13 A5 5 0 0 1 5 13 Q5 8 10 2Z" fill="#1B4F72" />
    </svg>
  )
}

function SunIcon({ animated }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="4" fill="#E89234" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <line
          key={i}
          x1={11 + 6 * Math.cos((deg * Math.PI) / 180)}
          y1={11 + 6 * Math.sin((deg * Math.PI) / 180)}
          x2={11 + 8.5 * Math.cos((deg * Math.PI) / 180)}
          y2={11 + 8.5 * Math.sin((deg * Math.PI) / 180)}
          stroke="#E89234"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

export default function TimelineSection() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [sunProgress, setSunProgress] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = null
    const duration = 2000
    const animate = (ts) => {
      if (!start) start = ts
      const prog = Math.min((ts - start) / duration, 1)
      setSunProgress(prog)
      if (prog < 1) requestAnimationFrame(animate)
    }
    const raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [inView])

  // Sun arc path: from left to right in a gentle arc
  // SVG arc for the sun path (viewBox: 0 0 800 120)
  const arcWidth = 760
  const arcHeight = 90
  const sunX = 20 + sunProgress * arcWidth
  const sunY = 110 - Math.sin(sunProgress * Math.PI) * arcHeight

  return (
    <section style={{ background: 'var(--cream)', padding: '7rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span className="eyebrow">Daily routine</span>
          <h2 style={{ marginBottom: '0.875rem' }}>The 5 AM advantage</h2>
          <p style={{ maxWidth: '480px', margin: '0 auto' }}>
            Every morning, before you wake up. Quiet. Automatic. Done by sunrise.
          </p>
        </motion.div>

        {/* Timeline container */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: '#fff',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden',
          }}
        >
          {/* Sun arc SVG */}
          <div style={{ position: 'relative', height: '130px', marginBottom: '0' }}>
            <svg
              viewBox="0 0 800 130"
              style={{ width: '100%', height: '130px' }}
              preserveAspectRatio="none"
            >
              {/* Arc path (dashed guide) */}
              <path
                d={`M 20 115 Q 400 ${115 - arcHeight * 2} 780 115`}
                stroke="rgba(232,146,52,0.2)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="4 6"
              />

              {/* Sun glow */}
              <circle cx={sunX} cy={sunY} r="20" fill="rgba(232,146,52,0.12)" />
              <circle cx={sunX} cy={sunY} r="12" fill="rgba(232,146,52,0.2)" />
              <circle cx={sunX} cy={sunY} r="7" fill="#E89234" />
              {/* Sun rays */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                <line
                  key={i}
                  x1={sunX + 10 * Math.cos((deg * Math.PI) / 180)}
                  y1={sunY + 10 * Math.sin((deg * Math.PI) / 180)}
                  x2={sunX + 16 * Math.cos((deg * Math.PI) / 180)}
                  y2={sunY + 16 * Math.sin((deg * Math.PI) / 180)}
                  stroke="#E89234"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              ))}
            </svg>
          </div>

          {/* Timeline bar */}
          <div style={{ position: 'relative' }}>
            {/* Main line */}
            <div
              style={{
                height: '3px',
                background: 'linear-gradient(to right, rgba(44,44,42,0.1), rgba(44,44,42,0.2), rgba(44,44,42,0.1))',
                borderRadius: '2px',
                marginBottom: '0',
                position: 'relative',
              }}
            >
              {/* Progress fill */}
              <motion.div
                initial={{ width: '0%' }}
                animate={inView ? { width: `${sunProgress * 100}%` } : { width: '0%' }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(to right, #1B4F72, #E89234)',
                  borderRadius: '2px',
                }}
              />
            </div>

            {/* Markers */}
            <div style={{ position: 'relative', height: '120px' }}>
              {timeMarkers.map((marker, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${marker.x}%`,
                    top: 0,
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {/* Dot */}
                  <div
                    style={{
                      width: marker.highlight ? '12px' : '6px',
                      height: marker.highlight ? '12px' : '6px',
                      borderRadius: '50%',
                      background: marker.highlight ? marker.color : 'rgba(44,44,42,0.25)',
                      border: marker.highlight ? `2px solid ${marker.color}` : 'none',
                      boxShadow: marker.highlight ? `0 0 0 4px ${marker.color}22` : 'none',
                      marginTop: marker.highlight ? '-5px' : '-2px',
                      flexShrink: 0,
                    }}
                  >
                    {/* Pulse ring for highlight */}
                    {marker.highlight && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: '-4px',
                          borderRadius: '50%',
                          border: `1.5px solid ${marker.color}`,
                          animation: 'pulse-ring 2s infinite',
                        }}
                      />
                    )}
                  </div>

                  {/* Time label */}
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.7rem',
                      fontWeight: marker.highlight ? 600 : 400,
                      color: marker.highlight ? marker.color : '#999',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {marker.time}
                  </span>

                  {/* Event label */}
                  {marker.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      {marker.icon === 'water' ? <WaterDropIcon /> : <SunIcon />}
                      <span
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.6875rem',
                          fontWeight: 500,
                          color: marker.color,
                          background: `${marker.color}14`,
                          padding: '2px 8px',
                          borderRadius: '100px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {marker.label}
                      </span>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Night / Day labels */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(44,44,42,0.07)',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: '#bbb', fontStyle: 'italic' }}>
              Night — system on standby
            </span>
            <span style={{ fontSize: '0.75rem', color: '#E89234', fontStyle: 'italic' }}>
              Cleaning window → Sunrise
            </span>
            <span style={{ fontSize: '0.75rem', color: '#bbb', fontStyle: 'italic' }}>
              Panels generating
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

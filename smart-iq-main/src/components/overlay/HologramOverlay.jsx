import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const COMPONENTS = [
  {
    name: 'Dual-Track Motor',
    desc: 'Waterless brushless motor, IP67 rated, designed for extreme Indian temperatures.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
      </svg>
    ),
    color: 'var(--amber)',
    glowColor: 'rgba(232,146,52,0.25)',
    pos: { top: '18%', right: '4%' },
    anchor: 'left',
  },
  {
    name: 'Optical Sensors',
    desc: 'LiDAR + IR array detects panel edges, obstacles, and soiling levels in real-time.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/>
      </svg>
    ),
    color: '#88ddff',
    glowColor: 'rgba(136,221,255,0.2)',
    pos: { top: '48%', left: '3%' },
    anchor: 'right',
  },
  {
    name: 'AI Control Hub',
    desc: 'On-board edge AI schedules cleaning based on weather, soiling index, and yield data.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
        <path d="M12 16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2zM6 8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2M18 8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2M9 12h6"/>
      </svg>
    ),
    color: '#aaffaa',
    glowColor: 'rgba(170,255,170,0.2)',
    pos: { bottom: '16%', right: '4%' },
    anchor: 'left',
  },
]

export default function HologramOverlay() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-12%' })

  return (
    <section
      id="hologram-overlay"
      ref={ref}
      style={{
        minHeight: '110vh',
        position: 'relative',
        zIndex: 10,
        padding: '8rem 8vw 6rem',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vw', height: '60vw',
        background: 'radial-gradient(circle, rgba(232,146,52,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'glow-breathe 5s ease-in-out infinite',
      }} />

      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          ANATOMY OF SPARSHIQ
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.16,1,0.3,1] }}
          style={{
            color: '#FAF7F2',
            maxWidth: '600px',
            margin: '1rem auto 0',
            textShadow: '0 2px 40px rgba(0,0,0,0.6)',
          }}
        >
          Engineering precision at every layer
        </motion.h2>
      </div>

      {/* Component cards — absolute positioned */}
      {COMPONENTS.map(({ name, desc, icon, color, glowColor, pos, anchor }, i) => (
        <motion.div
          key={name}
          initial={{ opacity: 0, scale: 0.8, y: 24 }}
          animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ delay: 0.4 + i * 0.22, duration: 0.7, type: 'spring', damping: 22, stiffness: 200 }}
          whileHover={{ scale: 1.04, y: -4 }}
          style={{
            position: 'absolute',
            ...pos,
            maxWidth: 240,
            background: 'rgba(8,12,22,0.72)',
            backdropFilter: 'blur(20px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
            border: `1px solid ${color}35`,
            borderRadius: 18,
            padding: '1.4rem 1.2rem',
            boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 30px ${glowColor}`,
            cursor: 'default',
            transition: 'box-shadow 0.3s ease',
          }}
          data-cursor="hover"
        >
          {/* Icon */}
          <div style={{
            width: 44, height: 44,
            borderRadius: 12,
            background: `${color}18`,
            border: `1px solid ${color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            marginBottom: '0.75rem',
            boxShadow: `0 0 16px ${glowColor}`,
          }}>
            {icon}
          </div>

          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.05rem',
            fontWeight: 600,
            color,
            marginBottom: '0.4rem',
            textShadow: `0 0 16px ${glowColor}`,
          }}>
            {name}
          </div>
          <div style={{
            color: 'rgba(250,247,242,0.58)',
            fontSize: '0.8rem',
            lineHeight: 1.55,
            fontFamily: 'var(--font-sans)',
          }}>
            {desc}
          </div>

          {/* Connector dot */}
          <div style={{
            position: 'absolute',
            width: 10, height: 10,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 16px ${color}, 0 0 30px ${color}60`,
            top: '50%',
            [anchor]: -5,
            transform: 'translateY(-50%)',
            animation: 'pulse-dot 2.5s ease-in-out infinite',
          }} />
        </motion.div>
      ))}

      {/* Central label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 1.1, duration: 0.9, ease: [0.16,1,0.3,1] }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
          fontWeight: 700,
          color: 'var(--amber)',
          textShadow: '0 0 50px var(--amber-glow), 0 0 100px rgba(232,146,52,0.2)',
          letterSpacing: '-0.025em',
        }}>
          SparshIQ Unit
        </div>
        <div style={{
          color: 'rgba(250,247,242,0.4)',
          fontSize: '0.85rem',
          marginTop: '0.35rem',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.05em',
        }}>
          Autonomous · 4 kg · IP67
        </div>

        {/* Rotating ring */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 120, height: 120,
          borderRadius: '50%',
          border: '1px dashed rgba(232,146,52,0.2)',
          animation: 'spin-slow 18s linear infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 170, height: 170,
          borderRadius: '50%',
          border: '1px dashed rgba(232,146,52,0.1)',
          animation: 'spin-slow 30s linear infinite reverse',
          pointerEvents: 'none',
        }} />
      </motion.div>
    </section>
  )
}

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const STATS = [
  {
    val: '₹87K',
    label: 'Average annual savings per 100kW system',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    color: '#E89234',
  },
  {
    val: '35%',
    label: 'Typical yield recovery after first clean',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    color: '#FFD166',
  },
  {
    val: '14mo',
    label: 'Median payback period for SparshIQ',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    color: '#88ddff',
  },
  {
    val: '0 L',
    label: 'Water consumed per cleaning cycle',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
      </svg>
    ),
    color: '#4BC97A',
  },
]

const APP_FEATURES = [
  'Real-time soiling index',
  'Daily cleaning logs',
  'Live yield analytics',
  'ROI tracking dashboard',
  'Weather-aware scheduling',
  'Push notification alerts',
]

export default function DashboardOverlay() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-12%' })

  return (
    <section
      id="dashboard-overlay"
      ref={ref}
      style={{
        minHeight: '110vh',
        display: 'flex',
        alignItems: 'center',
        padding: '6rem 8vw',
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        top: '50%', right: '-10%',
        transform: 'translateY(-50%)',
        width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(232,146,52,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'glow-breathe 6s ease-in-out infinite',
      }} />

      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

        {/* Left — copy + stats */}
        <div>
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            LIVE MONITORING
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.16,1,0.3,1] }}
            style={{
              color: '#FAF7F2',
              maxWidth: 480,
              marginTop: '1rem',
              textShadow: '0 2px 40px rgba(0,0,0,0.6)',
            }}
          >
            Your solar farm in the palm of your hand
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.7 }}
            style={{ color: 'rgba(250,247,242,0.6)', marginTop: '1.2rem', maxWidth: 400, lineHeight: 1.7 }}
          >
            The SparshIQ app delivers real-time soiling index, cleaning logs, yield analytics, and ROI tracking — accessible from anywhere.
          </motion.p>

          {/* Stat cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginTop: '2.5rem',
          }}>
            {STATS.map(({ val, label, icon, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.7, ease: [0.16,1,0.3,1] }}
                whileHover={{ y: -5, scale: 1.02 }}
                data-cursor="hover"
                style={{
                  background: 'rgba(8,12,22,0.72)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${color}22`,
                  borderRadius: 18,
                  padding: '1.4rem',
                  cursor: 'none',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${color}55`
                  e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.3), 0 0 30px ${color}15`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = `${color}22`
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Accent corner */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${color}, transparent)`,
                }} />
                <div style={{ color, marginBottom: '0.6rem' }}>{icon}</div>
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color,
                  lineHeight: 1,
                  textShadow: `0 0 20px ${color}60`,
                }}>
                  {val}
                </div>
                <div style={{
                  color: 'rgba(250,247,242,0.45)',
                  fontSize: '0.78rem',
                  lineHeight: 1.45,
                  marginTop: '0.4rem',
                  fontFamily: 'var(--font-sans)',
                }}>
                  {label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.7 }}
            style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
          >
            <a href="#" className="btn-amber" data-cursor="hover">
              Download App
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
            </a>
            <a href="#" className="btn-outline" data-cursor="hover">
              View Live Demo →
            </a>
          </motion.div>
        </div>

        {/* Right — App feature list card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.16,1,0.3,1] }}
          style={{
            background: 'rgba(8,12,22,0.75)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(232,146,52,0.2)',
            borderRadius: 24,
            padding: '2.25rem',
            position: 'relative',
            overflow: 'hidden',
            animation: 'border-glow 4s ease-in-out infinite',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, var(--amber), var(--amber-light), transparent)',
          }} />

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'rgba(250,247,242,0.4)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}>
            App Features
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {APP_FEATURES.map((feat, i) => (
              <motion.div
                key={feat}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.7 + i * 0.08, duration: 0.5 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem 1rem',
                  background: 'rgba(232,146,52,0.04)',
                  border: '1px solid rgba(232,146,52,0.1)',
                  borderRadius: 12,
                  fontSize: '0.875rem',
                  color: 'rgba(250,247,242,0.75)',
                  fontFamily: 'var(--font-sans)',
                  transition: 'background 0.2s ease, border-color 0.2s ease',
                  cursor: 'none',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(232,146,52,0.1)'
                  e.currentTarget.style.borderColor = 'rgba(232,146,52,0.3)'
                  e.currentTarget.style.color = '#FAF7F2'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(232,146,52,0.04)'
                  e.currentTarget.style.borderColor = 'rgba(232,146,52,0.1)'
                  e.currentTarget.style.color = 'rgba(250,247,242,0.75)'
                }}
              >
                <div style={{
                  width: 6, height: 6,
                  borderRadius: '50%',
                  background: 'var(--amber)',
                  boxShadow: '0 0 8px var(--amber-glow)',
                  flexShrink: 0,
                }} />
                {feat}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #dashboard-overlay > div > div:last-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const CITIES_MAP = [
  { name: 'Delhi NCR',  installs: 218, savings: '₹1.9Cr', peak: 'High', rank: 1 },
  { name: 'Bangalore',  installs: 186, savings: '₹1.6Cr', peak: 'Very High', rank: 2 },
  { name: 'Mumbai',     installs: 142, savings: '₹1.2Cr', peak: 'High', rank: 3 },
  { name: 'Hyderabad',  installs: 124, savings: '₹1.1Cr', peak: 'High', rank: 4 },
  { name: 'Ahmedabad',  installs: 108, savings: '₹93L',   peak: 'Extreme', rank: 5 },
  { name: 'Chennai',    installs:  97, savings: '₹84L',   peak: 'Very High', rank: 6 },
  { name: 'Pune',       installs:  89, savings: '₹77L',   peak: 'High', rank: 7 },
  { name: 'Kolkata',    installs:  63, savings: '₹54L',   peak: 'Moderate', rank: 8 },
]

const PEAK_COLORS = {
  'Extreme':   '#ff6b35',
  'Very High': '#E89234',
  'High':      '#FFD166',
  'Moderate':  '#88ddff',
}

const TOTALS = [
  { val: '1,027+',  label: 'Active Installations' },
  { val: '₹8.8 Cr', label: 'Total Savings Generated' },
  { val: '14M+',    label: 'Litres of Water Saved' },
]

export default function IndiaMapOverlay() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section
      id="india-map-overlay"
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
      {/* Map-glow background */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '80vw', height: '60vw',
        background: 'radial-gradient(ellipse, rgba(232,146,52,0.04) 0%, transparent 65%)',
        pointerEvents: 'none',
        animation: 'glow-breathe 7s ease-in-out infinite',
      }} />

      <div style={{ width: '100%' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}
          style={{ marginBottom: '3rem', maxWidth: 600 }}
        >
          <span className="eyebrow">SPARSHIQ ACROSS INDIA</span>
          <h2 style={{
            color: '#FAF7F2',
            marginTop: '0.5rem',
            textShadow: '0 2px 40px rgba(0,0,0,0.6)',
          }}>
            Deployed across India's solar heartland
          </h2>
          <p style={{ color: 'rgba(250,247,242,0.58)', marginTop: '0.875rem', lineHeight: 1.7 }}>
            From the desert rooftops of Ahmedabad to the tech corridors of Bangalore — SparshIQ operates 365 days a year.
          </p>
        </motion.div>

        {/* City cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
          gap: '1rem',
          maxWidth: 900,
        }}>
          {CITIES_MAP.map(({ name, installs, savings, peak, rank }, i) => {
            const dotColor = PEAK_COLORS[peak] || 'var(--amber)'
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.07, duration: 0.65, ease: [0.16,1,0.3,1] }}
                whileHover={{ y: -6, scale: 1.03 }}
                data-cursor="hover"
                style={{
                  background: 'rgba(8,12,22,0.72)',
                  backdropFilter: 'blur(18px)',
                  border: `1px solid ${dotColor}25`,
                  borderRadius: 16,
                  padding: '1.25rem',
                  cursor: 'none',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${dotColor}55`
                  e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.35), 0 0 24px ${dotColor}18`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = `${dotColor}25`
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Top shimmer line */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${dotColor}90, ${dotColor}30, transparent)`,
                }} />

                {/* Rank badge */}
                <div style={{
                  position: 'absolute', top: '0.75rem', right: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  color: `${dotColor}80`,
                  letterSpacing: '0.08em',
                }}>
                  #{rank}
                </div>

                {/* City name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: 8, height: 8,
                    borderRadius: '50%',
                    background: dotColor,
                    boxShadow: `0 0 10px ${dotColor}, 0 0 20px ${dotColor}60`,
                    animation: 'dot-pulse 2.5s ease-in-out infinite',
                    flexShrink: 0,
                  }} />
                  <div style={{
                    color: '#FAF7F2',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-sans)',
                  }}>
                    {name}
                  </div>
                </div>

                {/* Savings */}
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: dotColor,
                  textShadow: `0 0 20px ${dotColor}60`,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}>
                  {savings}
                </div>

                {/* Installs + peak */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '0.5rem',
                }}>
                  <div style={{
                    color: 'rgba(250,247,242,0.38)',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {installs} installs
                  </div>
                  <div style={{
                    fontSize: '0.62rem',
                    color: dotColor,
                    background: `${dotColor}15`,
                    border: `1px solid ${dotColor}35`,
                    borderRadius: 99,
                    padding: '2px 7px',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.06em',
                  }}>
                    {peak}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Totals strip */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.85, duration: 0.8, ease: [0.16,1,0.3,1] }}
          style={{
            display: 'flex',
            gap: '0',
            marginTop: '3.5rem',
            maxWidth: 640,
            background: 'rgba(8,12,22,0.72)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(232,146,52,0.18)',
            borderRadius: 20,
            overflow: 'hidden',
          }}
        >
          {TOTALS.map(({ val, label }, i) => (
            <div
              key={label}
              style={{
                flex: 1,
                padding: '1.5rem 1.25rem',
                textAlign: 'center',
                borderRight: i < TOTALS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                position: 'relative',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                fontWeight: 700,
                color: 'var(--amber)',
                textShadow: '0 0 24px var(--amber-glow)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}>
                {val}
              </div>
              <div style={{
                color: 'rgba(250,247,242,0.42)',
                fontSize: '0.76rem',
                marginTop: '0.4rem',
                fontFamily: 'var(--font-sans)',
                lineHeight: 1.4,
              }}>
                {label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

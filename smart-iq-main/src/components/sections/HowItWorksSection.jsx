import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const components = [
  {
    id: 'bar',
    name: 'Cleaning Bar',
    description: 'Soft EPDM foam strip. Replaceable in 30 seconds.',
    color: '#1B4F72',
    bg: 'rgba(27,79,114,0.07)',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
        <rect x="8" y="28" width="48" height="8" rx="4" fill="#1B4F72" opacity="0.15" />
        <rect x="8" y="29" width="48" height="6" rx="3" fill="#1B4F72" />
        <circle cx="16" cy="32" r="3" fill="#87CEEB" />
        <circle cx="32" cy="32" r="3" fill="#87CEEB" />
        <circle cx="48" cy="32" r="3" fill="#87CEEB" />
        {/* water drops */}
        <path d="M20 44 Q22 48 24 44 Q22 40 20 44Z" fill="#87CEEB" opacity="0.7" />
        <path d="M30 46 Q32 50 34 46 Q32 42 30 46Z" fill="#87CEEB" opacity="0.7" />
        <path d="M40 43 Q42 47 44 43 Q42 39 40 43Z" fill="#87CEEB" opacity="0.7" />
      </svg>
    ),
  },
  {
    id: 'sensor',
    name: 'Temperature Sensor',
    description: 'Measures panel surface heat without touching it.',
    color: '#E89234',
    bg: 'rgba(232,146,52,0.07)',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
        <circle cx="32" cy="40" r="10" fill="#E89234" opacity="0.15" />
        <circle cx="32" cy="40" r="6" fill="#E89234" />
        <rect x="29" y="14" width="6" height="22" rx="3" fill="#E89234" opacity="0.4" />
        <rect x="30" y="14" width="4" height="20" rx="2" fill="#E89234" />
        {/* notch lines */}
        {[20, 26, 32].map(y => (
          <line key={y} x1="34" y1={y} x2="39" y2={y} stroke="#E89234" strokeWidth="1.5" strokeLinecap="round" />
        ))}
        {/* IR waves */}
        <path d="M44 32 Q48 28 44 24" stroke="#E89234" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
        <path d="M47 34 Q53 28 47 22" stroke="#E89234" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.3" />
      </svg>
    ),
  },
  {
    id: 'controller',
    name: 'Smart Controller',
    description: 'Talks to your inverter directly. No extra wiring.',
    color: '#2D7A3F',
    bg: 'rgba(45,122,63,0.07)',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
        <rect x="12" y="18" width="40" height="28" rx="6" fill="#2D7A3F" opacity="0.12" />
        <rect x="12" y="18" width="40" height="28" rx="6" stroke="#2D7A3F" strokeWidth="2" />
        {/* LED indicator */}
        <circle cx="22" cy="27" r="3" fill="#2D7A3F" />
        <circle cx="32" cy="27" r="3" fill="#2D7A3F" opacity="0.4" />
        <circle cx="42" cy="27" r="3" fill="#2D7A3F" opacity="0.2" />
        {/* waveform */}
        <path d="M16 38 L20 38 L22 33 L26 43 L28 38 L32 38 L34 35 L36 41 L38 38 L48 38"
          stroke="#2D7A3F" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* wifi */}
        <path d="M26 13 Q32 8 38 13" stroke="#2D7A3F" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
        <path d="M28.5 16 Q32 13 35.5 16" stroke="#2D7A3F" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.8" />
        <circle cx="32" cy="18" r="1.5" fill="#2D7A3F" />
      </svg>
    ),
  },
  {
    id: 'mount',
    name: 'Frame Mount',
    description: 'Fits your existing solar frame. No drilling. No structural changes.',
    color: '#2C2C2A',
    bg: 'rgba(44,44,42,0.05)',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
        {/* Frame */}
        <rect x="10" y="16" width="44" height="32" rx="3" stroke="#2C2C2A" strokeWidth="2" fill="none" />
        {/* Bracket clips */}
        <rect x="8" y="22" width="8" height="6" rx="2" fill="#2C2C2A" opacity="0.7" />
        <rect x="48" y="22" width="8" height="6" rx="2" fill="#2C2C2A" opacity="0.7" />
        <rect x="8" y="36" width="8" height="6" rx="2" fill="#2C2C2A" opacity="0.7" />
        <rect x="48" y="36" width="8" height="6" rx="2" fill="#2C2C2A" opacity="0.7" />
        {/* snap indicator */}
        <path d="M28 32 L32 28 L36 32" stroke="#E89234" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="32" y1="28" x2="32" y2="38" stroke="#E89234" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function HowItWorksSection() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariant = {
    hidden: { opacity: 0, y: 36 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } },
  }

  return (
    <section
      id="how-it-works"
      style={{ background: '#fff', padding: '7rem 0' }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span className="eyebrow">Components</span>
          <h2 style={{ marginBottom: '0.875rem' }}>Built from the ground up for rooftops</h2>
          <p style={{ maxWidth: '500px', margin: '0 auto' }}>
            Every part engineered to survive the harshest Indian summers, monsoons, and dust storms.
          </p>
        </motion.div>

        {/* Assembly diagram + cards */}
        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {components.map((comp, i) => (
            <motion.div
              key={comp.id}
              variants={cardVariant}
              whileHover={{ y: -4, boxShadow: '0 20px 56px rgba(44,44,42,0.12)' }}
              style={{
                background: '#fff',
                border: '1px solid rgba(44,44,42,0.08)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                cursor: 'default',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '18px',
                  background: comp.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {comp.icon}
              </div>

              {/* Step number */}
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: comp.color,
                  textTransform: 'uppercase',
                }}
              >
                0{i + 1}
              </div>

              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    marginBottom: '0.5rem',
                    color: 'var(--charcoal)',
                  }}
                >
                  {comp.name}
                </h3>
                <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: '#6a6a68' }}>
                  {comp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ textAlign: 'center', marginTop: '3.5rem' }}
        >
          <a href="#pricing" className="btn-amber">
            See pricing
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

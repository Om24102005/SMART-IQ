import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const PATENTS = [
  {
    id: 'P-001',
    title: 'Dry-Wipe Microfibre Mechanism',
    desc: 'Zero-water cleaning system achieving 98% dust removal with a proprietary microfibre composition.',
    tag: 'Patented',
    color: '#E89234',
  },
  {
    id: 'P-002',
    title: 'Adaptive Edge-Detection Rail',
    desc: 'Self-calibrating rail system adapts to panel tilt angles from 0° to 45° without manual adjustment.',
    tag: 'Patent Pending',
    color: '#00ccff',
  },
  {
    id: 'P-003',
    title: 'Predictive Soiling Index',
    desc: 'ML model trained on 2M+ data points predicts optimal cleaning schedules per geographic location.',
    tag: 'Trade Secret',
    color: '#aaffaa',
  },
  {
    id: 'P-004',
    title: 'Wireless Power Coupling',
    desc: 'Inductive charging dock seamlessly integrated into the panel frame — no cables exposed to elements.',
    tag: 'Patent Pending',
    color: '#ff88cc',
  },
]

export default function BlueprintOverlay() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-12%' })

  return (
    <section
      id="blueprint-overlay"
      ref={ref}
      style={{
        minHeight: '110vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '8rem 8vw',
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden',
      }}
    >
      {/* Cyan ambient glow */}
      <div style={{
        position: 'absolute',
        bottom: '0', left: '50%',
        transform: 'translateX(-50%)',
        width: '70vw', height: '40vw',
        background: 'radial-gradient(ellipse at bottom, rgba(0,204,255,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ maxWidth: 580, marginBottom: '3.5rem' }}>
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ color: '#00ccff' }}
        >
          INTELLECTUAL PROPERTY
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.16,1,0.3,1] }}
          style={{ color: '#FAF7F2', marginTop: '1rem', textShadow: '0 2px 40px rgba(0,0,0,0.6)' }}
        >
          Built on a foundation of patented innovations
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.7 }}
          style={{ color: 'rgba(250,247,242,0.6)', marginTop: '1rem', lineHeight: 1.7 }}
        >
          Every component in SparshIQ is purpose-built and protected. Competitors can't copy what they can't reverse-engineer.
        </motion.p>
      </div>

      {/* Patent cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(265px, 1fr))',
        gap: '1.25rem',
      }}>
        {PATENTS.map(({ id, title, desc, tag, color }, i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 44 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35 + i * 0.14, duration: 0.75, ease: [0.16,1,0.3,1] }}
            whileHover={{ y: -6, scale: 1.02 }}
            data-cursor="hover"
            style={{
              background: 'rgba(5,10,25,0.78)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${color}28`,
              borderRadius: 18,
              padding: '1.75rem',
              cursor: 'none',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = `${color}60`
              e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.4), 0 0 30px ${color}18`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = `${color}28`
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* Top accent gradient */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg, ${color}80, ${color}20, transparent)`,
              borderRadius: '18px 18px 0 0',
            }} />

            {/* ID + Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: `${color}bb`,
                letterSpacing: '0.14em',
              }}>
                {id}
              </div>
              <div style={{
                fontSize: '0.63rem',
                fontWeight: 600,
                color,
                background: `${color}18`,
                border: `1px solid ${color}40`,
                borderRadius: 100,
                padding: '3px 10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
              }}>
                {tag}
              </div>
            </div>

            {/* Title */}
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#FAF7F2',
              marginBottom: '0.65rem',
              lineHeight: 1.3,
            }}>
              {title}
            </div>

            {/* Description */}
            <div style={{
              color: 'rgba(250,247,242,0.5)',
              fontSize: '0.82rem',
              lineHeight: 1.6,
              fontFamily: 'var(--font-sans)',
            }}>
              {desc}
            </div>

            {/* Bottom accent line */}
            <div style={{
              marginTop: '1.4rem',
              height: 1.5,
              background: `linear-gradient(to right, ${color}70, transparent)`,
              borderRadius: 1,
            }} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

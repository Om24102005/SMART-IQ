import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'

function AnimatedNumber({ target, trigger, prefix = '', suffix = '' }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!trigger) return
    const obj = { val: 0 }
    gsap.to(obj, {
      val: target,
      duration: 2.2,
      ease: 'power3.out',
      onUpdate: () => setValue(Math.round(obj.val)),
    })
  }, [trigger, target])
  return (
    <span>
      {prefix}{typeof value === 'number' && prefix === '₹'
        ? value.toLocaleString('en-IN')
        : value.toLocaleString()}{suffix}
    </span>
  )
}

const LOSS_STATS = [
  { val: 35,  suffix: '%', label: 'Yield loss in 30 days',   color: '#ff6b6b' },
  { val: 8,   suffix: '%', label: 'Weekly efficiency drop',  color: 'var(--amber)' },
  { val: 12,  suffix: 'Cr',label: 'Industry loss (₹) annually', color: '#88ddff' },
]

export default function MacroOverlay() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-18%' })

  return (
    <section
      id="macro-overlay"
      ref={ref}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '6rem 8vw',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden',
      }}
    >
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(232,146,52,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.span
        className="eyebrow"
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        THE REAL COST OF DIRTY PANELS
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 36 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.9, ease: [0.16,1,0.3,1] }}
        style={{
          color: '#FAF7F2',
          fontSize: 'clamp(2rem, 4.5vw, 3.6rem)',
          maxWidth: '640px',
          marginTop: '1rem',
          textShadow: '0 2px 40px rgba(0,0,0,0.5)',
          lineHeight: 1.1,
        }}
      >
        Every layer of dust is money you'll never see
      </motion.h2>

      {/* Big counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.45, duration: 0.9, ease: [0.16,1,0.3,1] }}
        style={{ marginTop: '3.5rem', position: 'relative' }}
      >
        {/* Glow ring */}
        <div style={{
          position: 'absolute',
          inset: '-30px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,146,52,0.12) 0%, transparent 70%)',
          animation: 'glow-breathe 4s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        <div style={{
          color: 'rgba(250,247,242,0.45)',
          fontSize: '0.78rem',
          letterSpacing: '0.14em',
          marginBottom: '0.6rem',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-mono)',
        }}>
          Average annual loss per 100kW system
        </div>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(4rem, 8vw, 6.5rem)',
          fontWeight: 700,
          lineHeight: 1,
          color: 'var(--amber)',
          textShadow: '0 0 60px rgba(232,146,52,0.5), 0 0 120px rgba(232,146,52,0.2)',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.03em',
        }}>
          ₹<AnimatedNumber target={87000} trigger={inView} />
        </div>
        <div style={{
          color: 'rgba(250,247,242,0.45)',
          fontSize: '1.05rem',
          marginTop: '0.6rem',
          fontFamily: 'var(--font-sans)',
        }}>
          per year · lost to dust degradation
        </div>
      </motion.div>

      {/* Loss stats cards */}
      <motion.div
        initial={{ opacity: 0, y: 44 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.75, duration: 0.9, ease: [0.16,1,0.3,1] }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.25rem',
          marginTop: '4.5rem',
          maxWidth: '740px',
          width: '100%',
        }}
      >
        {LOSS_STATS.map(({ val, suffix, label, color }, i) => (
          <motion.div
            key={label}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9 + i * 0.12, duration: 0.6 }}
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            {/* Colour accent top bar */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            }} />
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 700,
              color,
              textShadow: `0 0 24px ${color}60`,
              lineHeight: 1,
            }}>
              <AnimatedNumber target={val} trigger={inView} suffix={suffix} />
            </div>
            <div style={{
              color: 'rgba(250,247,242,0.5)',
              fontSize: '0.82rem',
              marginTop: '0.5rem',
              lineHeight: 1.4,
              fontFamily: 'var(--font-sans)',
            }}>
              {label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <style>{`
        @media (max-width: 600px) {
          #macro-overlay > div:last-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

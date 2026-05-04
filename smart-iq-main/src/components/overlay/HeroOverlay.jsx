import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const FINAL_TEXT = "Your panels are losing money every day."
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&'

function useTextScramble(text, trigger) {
  const [display, setDisplay] = useState(text)
  const frameRef = useRef(null)
  useEffect(() => {
    if (!trigger) return
    let iteration = 0
    const total = text.length * 4
    const animate = () => {
      setDisplay(
        text.split('').map((char, idx) => {
          if (char === ' ') return ' '
          if (idx < iteration / 4) return text[idx]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join('')
      )
      iteration++
      if (iteration <= total) frameRef.current = requestAnimationFrame(animate)
      else setDisplay(text)
    }
    setTimeout(() => { frameRef.current = requestAnimationFrame(animate) }, 400)
    return () => cancelAnimationFrame(frameRef.current)
  }, [trigger, text])
  return display
}

const STATS = [
  { val: '35%', label: 'yield loss in 30 days' },
  { val: '2.4L',  label: 'litres water saved/yr' },
  { val: '14mo',  label: 'system payback' },
]

export default function HeroOverlay() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })
  const headline = useTextScramble(FINAL_TEXT, inView)

  return (
    <section
      id="hero-overlay"
      ref={ref}
      style={{
        height: '100vh',
        minHeight: 600,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '0 8vw',
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden',
      }}
    >
      {/* Ambient light blob */}
      <div style={{
        position: 'absolute',
        top: '-20%', left: '-10%',
        width: '60vw', height: '60vw',
        background: 'radial-gradient(circle, rgba(232,146,52,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'glow-breathe 6s ease-in-out infinite',
      }} />

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.15, duration: 0.7, ease: [0.16,1,0.3,1] }}
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}
      >
        <span className="eyebrow" style={{ marginBottom: 0 }}>
          SPARSHIQ · AUTONOMOUS SOLAR CLEANING
        </span>
        <span style={{
          fontSize: '0.7rem',
          fontFamily: 'var(--font-mono)',
          color: 'rgba(250,247,242,0.4)',
          border: '1px solid rgba(232,146,52,0.25)',
          borderRadius: 99,
          padding: '2px 10px',
          letterSpacing: '0.08em',
        }}>
          v2.4 · BETA
        </span>
      </motion.div>

      {/* Main headline — scramble */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.35, duration: 0.6 }}
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)',
          fontWeight: 700,
          color: '#FAF7F2',
          lineHeight: 1.08,
          letterSpacing: '-0.035em',
          maxWidth: '720px',
          textShadow: '0 2px 60px rgba(0,0,0,0.7)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {headline}
      </motion.h1>

      {/* Sub-headline */}
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.1, duration: 0.9, ease: [0.16,1,0.3,1] }}
        style={{
          color: 'rgba(250,247,242,0.68)',
          fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
          maxWidth: '500px',
          marginTop: '1.6rem',
          lineHeight: 1.7,
          fontWeight: 350,
        }}
      >
        Dust accumulation cuts solar yield by up to&nbsp;
        <strong style={{ color: 'var(--amber)', fontWeight: 600 }}>35%</strong>.
        SparshIQ's AI-driven robotic cleaner operates autonomously — no water, no labour, no downtime.
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.4, duration: 0.8, ease: [0.16,1,0.3,1] }}
        style={{ display: 'flex', gap: '1rem', marginTop: '2.8rem', flexWrap: 'wrap' }}
      >
        <a
          href="#configurator-overlay"
          className="btn-amber"
          data-cursor="hover"
          style={{ fontSize: '1rem', padding: '1rem 2.2rem' }}
        >
          Calculate My Savings
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 4 }}>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <a
          href="#hologram-overlay"
          className="btn-outline"
          data-cursor="hover"
          style={{ fontSize: '1rem' }}
        >
          See how it works
        </a>
      </motion.div>

      {/* Live stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.8, duration: 0.8 }}
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '3.5rem',
          flexWrap: 'wrap',
        }}
      >
        {STATS.map(({ val, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.9 + i * 0.12, duration: 0.5, ease: [0.16,1,0.3,1] }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 99,
              padding: '0.45rem 1rem',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: 'var(--amber)',
              textShadow: '0 0 12px var(--amber-glow)',
            }}>
              {val}
            </span>
            <span style={{
              fontSize: '0.78rem',
              color: 'rgba(250,247,242,0.45)',
              fontFamily: 'var(--font-sans)',
            }}>
              {label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 2.3, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.6rem',
        }}
      >
        <span style={{
          color: 'rgba(250,247,242,0.4)',
          fontSize: '0.7rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-mono)',
        }}>
          Scroll to explore
        </span>
        {/* Mouse icon */}
        <div style={{
          width: 24, height: 38,
          border: '1.5px solid rgba(232,146,52,0.35)',
          borderRadius: 12,
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 6,
        }}>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            style={{
              width: 4, height: 4,
              borderRadius: '50%',
              background: 'var(--amber)',
              boxShadow: '0 0 8px var(--amber-glow)',
            }}
          />
        </div>
      </motion.div>
    </section>
  )
}

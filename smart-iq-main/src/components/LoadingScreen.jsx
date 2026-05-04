import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PARTICLE_COUNT = 80

function generateParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 0.3 + 0.1,
    delay: Math.random() * 2,
    opacity: Math.random() * 0.5 + 0.2,
  }))
}

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('loading') // loading | complete | hidden
  const particles = useRef(generateParticles())
  const startTime = useRef(Date.now())
  const rafRef = useRef(null)

  useEffect(() => {
    const DURATION = 2200 // ms
    const animate = () => {
      const elapsed = Date.now() - startTime.current
      const p = Math.min(elapsed / DURATION, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - p, 3)
      setProgress(eased)

      if (p < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setPhase('complete')
        // Wait a beat then hide
        setTimeout(() => {
          setPhase('hidden')
          onComplete?.()
        }, 600)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== 'hidden' && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            background: '#06080f',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* ── Particle Background ── */}
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            <defs>
              <radialGradient id="loading-glow">
                <stop offset="0%" stopColor="#E89234" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#E89234" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#loading-glow)" />
            {particles.current.map((p) => (
              <motion.circle
                key={p.id}
                cx={p.x + '%'}
                cy={p.y + '%'}
                r={p.size}
                fill="#E89234"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, p.opacity, 0],
                  y: [0, -30, 0],
                }}
                transition={{
                  duration: 3 + p.speed * 2,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </svg>

          {/* ── Central Content ── */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2rem',
            }}
          >
            {/* Logo / Brand mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: 'var(--amber)',
                  boxShadow: '0 0 20px var(--amber-glow), 0 0 40px rgba(232,146,52,0.3)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                  fontWeight: 700,
                  color: '#FAF7F2',
                  letterSpacing: '-0.03em',
                }}
              >
                SparshIQ
              </span>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{
                color: 'rgba(250,247,242,0.4)',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: '-1rem',
              }}
            >
              Autonomous Solar Cleaning
            </motion.p>

            {/* ── Progress Bar ── */}
            <div
              style={{
                width: 'clamp(160px, 20vw, 280px)',
                height: 2,
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <motion.div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--amber-dark), var(--amber-light))',
                  borderRadius: 2,
                  boxShadow: '0 0 12px rgba(232,146,52,0.5)',
                }}
                initial={{ width: '0%' }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>

            {/* Percentage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'rgba(250,247,242,0.3)',
                letterSpacing: '0.1em',
                marginTop: '-0.5rem',
              }}
            >
              {Math.round(progress * 100)}%
            </motion.div>
          </div>

          {/* ── Bottom status ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              position: 'absolute',
              bottom: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '0.35rem',
                alignItems: 'center',
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'var(--amber)',
                  }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'rgba(250,247,242,0.2)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {phase === 'complete' ? 'Ready' : 'Initializing'}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

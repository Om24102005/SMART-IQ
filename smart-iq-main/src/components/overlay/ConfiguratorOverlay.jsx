import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune']
const CITY_FACTOR = {
  Mumbai: 1.0, Delhi: 0.88, Bangalore: 1.12,
  Chennai: 1.05, Hyderabad: 0.96, Pune: 1.08,
}
const ROOF_TYPES = [
  { key: 'flat',       label: 'Flat RCC',    emoji: '🏢', factor: 1.0 },
  { key: 'terracotta', label: 'Terracotta',  emoji: '🏠', factor: 0.95 },
]

function calcSavings(panels, city, roof) {
  const basePerPanel = 4200
  const cityFactor   = CITY_FACTOR[city] || 1
  const roofFactor   = ROOF_TYPES.find(r => r.key === roof)?.factor || 1
  return Math.round(panels * basePerPanel * cityFactor * roofFactor)
}

function AnimatedSavings({ value }) {
  const [displayed, setDisplayed] = useState(value)
  const prev = useRef(value)

  useEffect(() => {
    if (value === prev.current) return
    const start = prev.current
    const end   = value
    const dur   = 600
    const startTime = performance.now()

    const frame = (now) => {
      const t = Math.min((now - startTime) / dur, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setDisplayed(Math.round(start + (end - start) * ease))
      if (t < 1) requestAnimationFrame(frame)
      else prev.current = end
    }
    requestAnimationFrame(frame)
  }, [value])

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      ₹{displayed.toLocaleString('en-IN')}
    </span>
  )
}

export default function ConfiguratorOverlay({ onStateChange }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })
  const [panelCount, setPanelCount] = useState(6)
  const [city,       setCity]       = useState('Mumbai')
  const [roofType,   setRoofType]   = useState('flat')

  const savings = calcSavings(panelCount, city, roofType)
  const monthlyAvg = Math.round(savings / 12)

  const update = useCallback((panels, c, roof) => {
    onStateChange?.({ panelCount: panels, city: c, roofType: roof })
  }, [onStateChange])

  const handlePanels = (v) => { setPanelCount(v); update(v, city, roofType) }
  const handleCity   = (c) => { setCity(c);       update(panelCount, c, roofType) }
  const handleRoof   = (r) => { setRoofType(r);   update(panelCount, city, r) }

  // Track range fill %
  const fillPct = ((panelCount - 2) / (20 - 2)) * 100

  return (
    <section
      id="configurator-overlay"
      ref={ref}
      style={{
        minHeight: '110vh',
        display: 'flex',
        alignItems: 'center',
        padding: '7rem 8vw',
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        bottom: '10%', right: '5%',
        width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(232,146,52,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'glow-breathe 7s ease-in-out infinite',
      }} />

      <div style={{ width: '100%', maxWidth: 920 }}>
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          SAVINGS CONFIGURATOR
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.16,1,0.3,1] }}
          style={{
            color: '#FAF7F2',
            maxWidth: 560,
            marginTop: '1rem',
            textShadow: '0 2px 40px rgba(0,0,0,0.6)',
          }}
        >
          Configure your solar setup
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 44 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.16,1,0.3,1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2.5rem',
            marginTop: '3.5rem',
          }}
        >
          {/* ── Left: Controls ─────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>

            {/* Panel slider */}
            <div>
              <label style={{
                color: 'rgba(250,247,242,0.65)',
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.875rem',
              }}>
                <span>Solar Panels</span>
                <span style={{
                  color: 'var(--amber)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textShadow: '0 0 12px var(--amber-glow)',
                }}>
                  {panelCount}
                </span>
              </label>

              {/* Custom slider track */}
              <div style={{ position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}>
                <div style={{
                  position: 'absolute',
                  left: 0, right: 0, height: 4,
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${fillPct}%`,
                    background: 'linear-gradient(90deg, var(--amber-dark), var(--amber-light))',
                    borderRadius: 2,
                    boxShadow: '0 0 12px rgba(232,146,52,0.5)',
                    transition: 'width 0.15s ease',
                  }} />
                </div>
                <input
                  type="range"
                  min={2} max={20}
                  value={panelCount}
                  onChange={e => handlePanels(Number(e.target.value))}
                  data-cursor="hover"
                  style={{
                    position: 'absolute',
                    left: 0, right: 0,
                    width: '100%',
                    background: 'transparent',
                    cursor: 'none',
                  }}
                />
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: 'rgba(250,247,242,0.25)',
                fontSize: '0.7rem',
                marginTop: '0.4rem',
                fontFamily: 'var(--font-mono)',
              }}>
                <span>2</span><span>20 panels</span>
              </div>
            </div>

            {/* Roof type */}
            <div>
              <label style={{
                color: 'rgba(250,247,242,0.65)',
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                display: 'block',
                marginBottom: '0.875rem',
              }}>
                Roof Type
              </label>
              <div style={{ display: 'flex', gap: '0.875rem' }}>
                {ROOF_TYPES.map(r => (
                  <button
                    key={r.key}
                    onClick={() => handleRoof(r.key)}
                    data-cursor="hover"
                    style={{
                      flex: 1,
                      padding: '0.75rem 0.5rem',
                      borderRadius: 14,
                      border: `1.5px solid ${roofType === r.key ? 'var(--amber)' : 'rgba(255,255,255,0.1)'}`,
                      background: roofType === r.key ? 'rgba(232,146,52,0.12)' : 'rgba(255,255,255,0.03)',
                      color: roofType === r.key ? 'var(--amber)' : 'rgba(250,247,242,0.45)',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      cursor: 'none',
                      transition: 'all 0.22s ease',
                      fontFamily: 'var(--font-sans)',
                      boxShadow: roofType === r.key ? '0 0 20px rgba(232,146,52,0.15)' : 'none',
                    }}
                  >
                    <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{r.emoji}</div>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* City selector */}
            <div>
              <label style={{
                color: 'rgba(250,247,242,0.65)',
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                display: 'block',
                marginBottom: '0.875rem',
              }}>
                Your City
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
                {CITIES.map(c => (
                  <button
                    key={c}
                    onClick={() => handleCity(c)}
                    data-cursor="hover"
                    style={{
                      padding: '0.45rem 1.1rem',
                      borderRadius: 100,
                      border: `1.5px solid ${city === c ? 'var(--amber)' : 'rgba(255,255,255,0.1)'}`,
                      background: city === c ? 'rgba(232,146,52,0.14)' : 'transparent',
                      color: city === c ? 'var(--amber)' : 'rgba(250,247,242,0.45)',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      cursor: 'none',
                      transition: 'all 0.22s ease',
                      fontFamily: 'var(--font-sans)',
                      boxShadow: city === c ? '0 0 16px rgba(232,146,52,0.12)' : 'none',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Savings output ──────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div
              className="glass-card animate-border-glow"
              style={{
                background: 'rgba(8, 12, 22, 0.7)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(232,146,52,0.22)',
                borderRadius: 24,
                padding: '2.25rem',
                boxShadow: '0 12px 50px rgba(0,0,0,0.5), 0 0 60px rgba(232,146,52,0.06)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: 'linear-gradient(90deg, transparent, var(--amber), var(--amber-light), transparent)',
              }} />

              <div style={{
                color: 'rgba(250,247,242,0.45)',
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                marginBottom: '0.6rem',
              }}>
                Estimated Annual Recovery
              </div>

              {/* Big animated number */}
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.6rem, 4.5vw, 3.8rem)',
                fontWeight: 700,
                color: 'var(--amber)',
                lineHeight: 1.05,
                textShadow: '0 0 40px rgba(232,146,52,0.45)',
                letterSpacing: '-0.03em',
              }}>
                <AnimatedSavings value={savings} />
              </div>

              {/* Monthly */}
              <div style={{
                marginTop: '0.4rem',
                fontSize: '0.82rem',
                color: 'rgba(250,247,242,0.4)',
                fontFamily: 'var(--font-sans)',
              }}>
                ≈ ₹{monthlyAvg.toLocaleString('en-IN')} / month · {city} · {panelCount} panels
              </div>

              {/* Stats breakdown */}
              <div style={{
                marginTop: '1.75rem',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>
                {[
                  { label: 'Cleaning frequency',  val: 'Every 4–7 days' },
                  { label: 'System payback',       val: '14 months' },
                  { label: 'Water saved / year',   val: '~12,000 L' },
                  { label: 'CO₂ avoided / year',   val: '~480 kg' },
                ].map(({ label, val }) => (
                  <div key={label} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.82rem',
                  }}>
                    <span style={{ color: 'rgba(250,247,242,0.4)', fontFamily: 'var(--font-sans)' }}>{label}</span>
                    <span style={{
                      color: '#FAF7F2',
                      fontWeight: 600,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                    }}>
                      {val}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href="mailto:contact@sparshiq.com"
                className="btn-amber"
                data-cursor="hover"
                style={{ marginTop: '1.75rem', width: '100%', justifyContent: 'center' }}
              >
                Get a Free Site Audit →
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #configurator-overlay > div > div:last-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

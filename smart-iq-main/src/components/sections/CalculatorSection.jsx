import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

function useLerpedNumber(target) {
  const [display, setDisplay] = useState(target)
  const currentRef = useRef(target)
  const targetRef = useRef(target)
  const rafRef = useRef()

  targetRef.current = target

  useEffect(() => {
    const animate = () => {
      currentRef.current += (targetRef.current - currentRef.current) * 0.08
      setDisplay(Math.round(currentRef.current))
      if (Math.abs(targetRef.current - currentRef.current) > 0.5) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setDisplay(targetRef.current)
      }
    }
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target])

  return display
}

function StatCard({ label, value, prefix = '', suffix = '', decimals = 0, color = 'var(--amber)', delay = 0 }) {
  const formatted = decimals > 0
    ? value.toFixed(decimals)
    : value.toLocaleString('en-IN')

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      style={{
        background: '#fff',
        border: '1px solid rgba(44,44,42,0.08)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        textAlign: 'center',
        boxShadow: 'var(--shadow-sm)',
        flex: '1 1 200px',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
          fontWeight: 600,
          color,
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
          marginBottom: '0.5rem',
        }}
      >
        {prefix}{formatted}{suffix}
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#888' }}>
        {label}
      </div>
    </motion.div>
  )
}

export default function CalculatorSection() {
  const [panels, setPanels] = useState(8)
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const savedPerYear = panels * 1200
  const payback = Math.round((50000 / (panels * 1200)) * 10) / 10
  const total25 = panels * 1200 * 25

  const lerpedSaved = useLerpedNumber(savedPerYear)
  const lerpedPayback = useLerpedNumber(payback * 10)
  const lerpedTotal = useLerpedNumber(total25)

  // Bar chart values (normalised)
  const withoutMax = 3000
  const withMax = 3000
  const withoutLoss = Math.min(100, (panels * 480) / withoutMax * 100)
  const withSaved = Math.min(100, (panels * 1200) / withMax * 100)

  return (
    <section id="calculator" style={{ background: '#fff', padding: '7rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <span className="eyebrow">ROI Calculator</span>
          <h2 style={{ marginBottom: '0.875rem' }}>See the return on your investment</h2>
          <p style={{ maxWidth: '460px', margin: '0 auto' }}>
            Move the slider. Watch the math.
          </p>
        </motion.div>

        <div ref={ref}>
          {/* Slider */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{
              background: 'var(--cream)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <label
                htmlFor="panel-count"
                style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.9375rem', color: 'var(--charcoal)' }}
              >
                Number of solar panels
              </label>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: 'var(--amber)',
                }}
              >
                {panels} panels
              </span>
            </div>

            <input
              id="panel-count"
              type="range"
              min="4"
              max="30"
              value={panels}
              onChange={(e) => setPanels(Number(e.target.value))}
              style={{
                width: '100%',
                height: '4px',
                WebkitAppearance: 'none',
                appearance: 'none',
                background: `linear-gradient(to right, var(--amber) 0%, var(--amber) ${((panels - 4) / 26) * 100}%, rgba(44,44,42,0.15) ${((panels - 4) / 26) * 100}%, rgba(44,44,42,0.15) 100%)`,
                borderRadius: '2px',
                outline: 'none',
                cursor: 'pointer',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#999', fontFamily: 'var(--font-sans)' }}>4 panels</span>
              <span style={{ fontSize: '0.75rem', color: '#999', fontFamily: 'var(--font-sans)' }}>30 panels</span>
            </div>
          </motion.div>

          {/* Stat cards */}
          <div
            style={{
              display: 'flex',
              gap: '1.25rem',
              flexWrap: 'wrap',
              marginBottom: '2.5rem',
            }}
          >
            <StatCard
              label="Saved per year"
              value={lerpedSaved}
              prefix="Rs "
              color="var(--foliage)"
              delay={0}
            />
            <StatCard
              label="Payback period"
              value={lerpedPayback / 10}
              suffix=" years"
              decimals={1}
              color="var(--amber)"
              delay={0.1}
            />
            <StatCard
              label="25-year total savings"
              value={lerpedTotal}
              prefix="Rs "
              color="var(--panel-blue)"
              delay={0.2}
            />
          </div>

          {/* Bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{
              background: 'var(--cream)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#888',
                marginBottom: '1.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Annual value comparison
            </h3>

            {/* Without SparshIQ */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#888' }}>
                  Without SparshIQ (dust losses)
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600, color: '#c0392b' }}>
                  – Rs {(panels * 480).toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ height: '10px', background: 'rgba(44,44,42,0.08)', borderRadius: '5px', overflow: 'hidden' }}>
                <motion.div
                  animate={{ width: `${withoutLoss}%` }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(to right, #e74c3c, #c0392b)',
                    borderRadius: '5px',
                  }}
                />
              </div>
            </div>

            {/* With SparshIQ */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#888' }}>
                  With SparshIQ (recovered value)
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--foliage)' }}>
                  + Rs {lerpedSaved.toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ height: '10px', background: 'rgba(44,44,42,0.08)', borderRadius: '5px', overflow: 'hidden' }}>
                <motion.div
                  animate={{ width: `${withSaved}%` }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(to right, #27ae60, #2D7A3F)',
                    borderRadius: '5px',
                  }}
                />
              </div>
            </div>

            <p style={{ fontSize: '0.8125rem', color: '#bbb', marginTop: '1.25rem', fontStyle: 'italic' }}>
              Based on average Indian residential solar output and dust accumulation rates.
            </p>
          </motion.div>
        </div>
      </div>

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--amber);
          cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(232,146,52,0.4);
          transition: transform 0.15s ease;
        }
        input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        input[type='range']::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--amber);
          cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(232,146,52,0.4);
        }
      `}</style>
    </section>
  )
}

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

/* ── Power chart data ──────────────────────────────────────── */
const HOURS = Array.from({ length: 14 }, (_, i) => i + 5) // 5AM to 6PM
const DIRTY_OUTPUT = [0, 0.05, 0.2, 0.4, 0.52, 0.6, 0.62, 0.6, 0.55, 0.48, 0.38, 0.22, 0.08, 0]
const CLEAN_OUTPUT = [0, 0.08, 0.3, 0.58, 0.78, 0.9, 0.95, 0.92, 0.85, 0.72, 0.55, 0.32, 0.12, 0]

function PowerChart({ inView }) {
  const W = 260
  const H = 130
  const PAD = 12

  const toPoint = (data, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
    y: H - PAD - data[i] * (H - PAD * 2),
  })

  const makePath = (data) =>
    data.map((_, i) => {
      const p = toPoint(data, i)
      return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    }).join(' ')

  const makeArea = (data) =>
    data.map((_, i) => {
      const p = toPoint(data, i)
      return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    }).join(' ') + ` L ${PAD + (W - PAD * 2)} ${H - PAD} L ${PAD} ${H - PAD} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '130px' }}>
      <defs>
        <linearGradient id="cleanGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2D7A3F" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#2D7A3F" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="dirtyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c0392b" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#c0392b" stopOpacity="0" />
        </linearGradient>

        <clipPath id="chartReveal">
          <motion.rect
            x="0" y="0"
            width={inView ? W : 0}
            height={H}
            animate={{ width: inView ? W : 0 }}
            transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          />
        </clipPath>
      </defs>

      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map((v) => (
        <line
          key={v}
          x1={PAD}
          y1={H - PAD - v * (H - PAD * 2)}
          x2={W - PAD}
          y2={H - PAD - v * (H - PAD * 2)}
          stroke="rgba(44,44,42,0.07)"
          strokeWidth="1"
        />
      ))}

      <g clipPath="url(#chartReveal)">
        {/* Dirty area */}
        <path d={makeArea(DIRTY_OUTPUT)} fill="url(#dirtyGrad)" />
        {/* Dirty line */}
        <path d={makePath(DIRTY_OUTPUT)} stroke="#c0392b" strokeWidth="1.5" fill="none" strokeDasharray="4 3" opacity="0.6" />

        {/* Clean area */}
        <path d={makeArea(CLEAN_OUTPUT)} fill="url(#cleanGrad)" />
        {/* Clean line */}
        <path d={makePath(CLEAN_OUTPUT)} stroke="#2D7A3F" strokeWidth="2" fill="none" />

        {/* Cleaning marker at 5:12AM (index 0-1) */}
        <line x1={PAD + 8} y1={PAD} x2={PAD + 8} y2={H - PAD} stroke="#1B4F72" strokeWidth="1" strokeDasharray="3 2" />
        <circle cx={PAD + 8} cy={PAD + 8} r="3" fill="#1B4F72" />
      </g>

      {/* Cleaning marker label */}
      <text x={PAD + 11} y={PAD + 8} fontSize="7" fill="#1B4F72" fontFamily="Inter,sans-serif">
        Cleaning
      </text>

      {/* Axis labels */}
      {['5AM', '8AM', '12PM', '6PM'].map((label, i) => (
        <text
          key={i}
          x={PAD + (i / 3) * (W - PAD * 2)}
          y={H - 1}
          fontSize="7"
          fill="rgba(44,44,42,0.4)"
          textAnchor="middle"
          fontFamily="Inter,sans-serif"
        >
          {label}
        </text>
      ))}
    </svg>
  )
}

/* ── Phone mockup ──────────────────────────────────────────── */
function PhoneMockup({ inView }) {
  const [savings, setSavings] = useState(0)
  const savRef = useRef(0)
  const rafRef = useRef()

  useEffect(() => {
    if (!inView) return
    const target = 4280
    const animate = () => {
      savRef.current += (target - savRef.current) * 0.03
      setSavings(Math.round(savRef.current))
      if (Math.abs(target - savRef.current) > 0.5) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [inView])

  return (
    <div
      style={{
        width: '280px',
        height: '560px',
        background: '#111',
        borderRadius: '44px',
        padding: '14px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08) inset',
        position: 'relative',
        margin: '0 auto',
      }}
    >
      {/* Notch */}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90px',
          height: '28px',
          background: '#111',
          borderRadius: '0 0 18px 18px',
          zIndex: 10,
        }}
      />

      {/* Screen */}
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#FAF7F2',
          borderRadius: '32px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Status bar */}
        <div
          style={{
            height: '44px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '8px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--charcoal)',
              letterSpacing: '-0.02em',
            }}
          >
            SparshIQ
          </span>
        </div>

        {/* App content */}
        <div style={{ flex: 1, padding: '1rem', overflow: 'hidden' }}>
          {/* Date */}
          <div style={{ fontSize: '0.6875rem', color: '#999', marginBottom: '0.75rem', fontFamily: 'Inter, sans-serif' }}>
            Today — Sunday, May 3
          </div>

          {/* Savings card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1B4F72, #0d3350)',
              borderRadius: '16px',
              padding: '1rem',
              marginBottom: '0.75rem',
              color: '#fff',
            }}
          >
            <div style={{ fontSize: '0.6875rem', opacity: 0.7, marginBottom: '0.25rem', fontFamily: 'Inter, sans-serif' }}>
              Saved this year
            </div>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.5rem',
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              Rs {savings.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.625rem', opacity: 0.6, marginTop: '0.25rem', fontFamily: 'Inter, sans-serif' }}>
              vs. unclean panels
            </div>
          </div>

          {/* Power chart */}
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '0.625rem',
              marginBottom: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 500, color: '#444', fontFamily: 'Inter, sans-serif' }}>
                Power output
              </span>
              <span style={{ fontSize: '0.625rem', color: '#2D7A3F', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                +21% today
              </span>
            </div>
            <PowerChart inView={inView} />
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '0.5625rem', color: '#2D7A3F', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Inter, sans-serif' }}>
                <span style={{ width: '12px', height: '2px', background: '#2D7A3F', display: 'inline-block', borderRadius: '1px' }} />
                Clean
              </span>
              <span style={{ fontSize: '0.5625rem', color: '#c0392b', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Inter, sans-serif', opacity: 0.7 }}>
                <span style={{ width: '12px', height: '2px', background: '#c0392b', display: 'inline-block', borderRadius: '1px' }} />
                Dirty
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              { label: 'Last cleaned', value: '5:14 AM', color: '#1B4F72' },
              { label: "Today's output", value: '340 W', color: '#2D7A3F' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: '#fff',
                  borderRadius: '10px',
                  padding: '0.625rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: stat.color, fontFamily: 'Inter, sans-serif' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.5625rem', color: '#999', marginTop: '2px', fontFamily: 'Inter, sans-serif' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom nav */}
        <div
          style={{
            height: '56px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            borderTop: '1px solid rgba(44,44,42,0.06)',
          }}
        >
          {['Home', 'Stats', 'Settings'].map((tab) => (
            <span
              key={tab}
              style={{
                fontSize: '0.5625rem',
                color: tab === 'Home' ? 'var(--amber)' : '#bbb',
                fontFamily: 'Inter, sans-serif',
                fontWeight: tab === 'Home' ? 600 : 400,
              }}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Feature card with 3D tilt ─────────────────────────────── */
function FeatureCard({ title, description, icon }) {
  const cardRef = useRef()

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    cardRef.current.style.transform = `perspective(600px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) translateZ(4px)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateZ(0px)'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background: '#fff',
        border: '1px solid rgba(44,44,42,0.08)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: 'var(--shadow-sm)',
        willChange: 'transform',
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '0.875rem' }}>{icon}</div>
      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.0625rem',
          fontWeight: 500,
          marginBottom: '0.5rem',
          color: 'var(--charcoal)',
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: '#6a6a68', lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  )
}

export default function DashboardSection() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section style={{ background: 'var(--cream)', padding: '7rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span className="eyebrow">Dashboard</span>
          <h2 style={{ marginBottom: '0.875rem' }}>Numbers that matter. Updated daily.</h2>
          <p style={{ maxWidth: '480px', margin: '0 auto' }}>
            The dashboard you actually want. Real data, not just green dots.
          </p>
        </motion.div>

        {/* Phone mockup */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          style={{ marginBottom: '4rem' }}
        >
          <PhoneMockup inView={inView} />
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          <FeatureCard
            icon="📊"
            title="See exactly how much your panels made today"
            description="Live production data synced from your inverter every 15 minutes."
          />
          <FeatureCard
            icon="⚡"
            title="Compare clean panels vs dirty in real numbers"
            description="Before/after cleaning data visualised so you see the real difference."
          />
          <FeatureCard
            icon="🔔"
            title="Get notified if anything needs attention"
            description="Smart alerts for missed cleanings, low output, or maintenance windows."
          />
        </motion.div>
      </div>
    </section>
  )
}

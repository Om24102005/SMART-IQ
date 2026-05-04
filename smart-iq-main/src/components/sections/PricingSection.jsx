import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const plans = [
  {
    id: 'lite',
    name: 'SparshIQ Lite',
    price: '₹30,000',
    suffix: ' onwards',
    tagline: 'For small rooftops',
    panels: '4–6 panels',
    highlight: false,
    features: [
      'Daily automatic cleaning',
      'Cleaning bar + EPDM strip',
      'Basic app with cleaning history',
      'Rain sensor included',
      '1-year warranty',
    ],
    cta: 'Get started',
    ctaStyle: 'outline',
  },
  {
    id: 'pro',
    name: 'SparshIQ Pro',
    price: '₹50,000',
    suffix: ' onwards',
    tagline: 'Most popular',
    panels: '8–12 panels',
    highlight: true,
    features: [
      'Everything in Lite',
      'Full dashboard with live charts',
      'Inverter sync (real-time data)',
      'Annual maintenance visit',
      'Priority support · 24h response',
      '2-year warranty',
    ],
    cta: 'Get Pro',
    ctaStyle: 'amber',
  },
  {
    id: 'enterprise',
    name: 'SparshIQ Enterprise',
    price: 'Talk to us',
    suffix: '',
    tagline: 'Societies & large rooftops',
    panels: 'Custom configuration',
    highlight: false,
    features: [
      'Unlimited panel coverage',
      'Custom installation design',
      'Dedicated account manager',
      'White-label app available',
      'SLA-backed uptime guarantee',
      '5-year warranty',
    ],
    cta: 'Contact us',
    ctaStyle: 'outline',
  },
]

function CheckIcon({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <circle cx="9" cy="9" r="8" fill={color} fillOpacity="0.12"/>
      <path d="M5.5 9l2.5 2.5 4-5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function PricingCard({ plan, delay }) {
  const cardRef = useRef()
  const inView  = useInView(cardRef, { once: true, margin: '-40px' })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current || plan.highlight) return
    const rect = cardRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top  + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    cardRef.current.style.transform = `perspective(900px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) scale(1.01)`
  }
  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(900px) rotateY(0) rotateX(0) scale(1)'
    setHovered(false)
  }

  const checkColor = plan.highlight ? 'var(--amber)' : 'var(--foliage)'

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.16,1,0.3,1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        background: plan.highlight
          ? 'linear-gradient(160deg, #1e1a14 0%, #161210 100%)'
          : '#fff',
        border: plan.highlight
          ? '1.5px solid rgba(232,146,52,0.45)'
          : '1px solid rgba(44,44,42,0.09)',
        borderRadius: 'var(--radius-xl)',
        padding: plan.highlight ? '2.75rem 2.25rem' : '2.25rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.35rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: plan.highlight
          ? '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(232,146,52,0.2), 0 0 80px rgba(232,146,52,0.06)'
          : '0 4px 24px rgba(44,44,42,0.07)',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
        willChange: 'transform',
        transform: plan.highlight ? 'scale(1.04)' : 'scale(1)',
        animation: plan.highlight ? 'border-glow 4s ease-in-out infinite' : 'none',
      }}
    >
      {/* PRO top glow stripe */}
      {plan.highlight && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, var(--amber), var(--amber-light), transparent)',
        }} />
      )}

      {/* Recommended badge */}
      {plan.highlight && (
        <div style={{
          position: 'absolute', top: '1.25rem', right: '1.25rem',
          background: 'linear-gradient(135deg, var(--amber-light), var(--amber-dark))',
          color: '#fff',
          fontSize: '0.68rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '4px 12px',
          borderRadius: 99,
          fontFamily: 'var(--font-mono)',
          boxShadow: '0 4px 12px rgba(232,146,52,0.4)',
        }}>
          ✦ Popular
        </div>
      )}

      {/* Plan label */}
      <div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: plan.highlight ? 'var(--amber)' : '#bbb',
          marginBottom: '0.4rem',
        }}>
          {plan.tagline}
        </div>
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.4rem',
          fontWeight: 600,
          color: plan.highlight ? '#FAF7F2' : 'var(--charcoal)',
          margin: 0,
        }}>
          {plan.name}
        </h3>
      </div>

      {/* Price */}
      <div>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
          fontWeight: 700,
          color: plan.highlight ? '#fff' : 'var(--charcoal)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}>
          {plan.price}
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
            fontWeight: 400,
            color: plan.highlight ? 'rgba(255,255,255,0.4)' : '#bbb',
            marginLeft: 2,
          }}>
            {plan.suffix}
          </span>
        </div>
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.8125rem',
          color: plan.highlight ? 'rgba(255,255,255,0.4)' : '#aaa',
          marginTop: '0.3rem',
        }}>
          {plan.panels}
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: 1,
        background: plan.highlight
          ? 'rgba(255,255,255,0.07)'
          : 'rgba(44,44,42,0.08)',
      }} />

      {/* Features */}
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }}>
        {plan.features.map(feat => (
          <li key={feat} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
            color: plan.highlight ? 'rgba(255,255,255,0.78)' : '#5a5a58',
            lineHeight: 1.55,
          }}>
            <CheckIcon color={checkColor} />
            {feat}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="#"
        style={{
          display: 'block',
          textAlign: 'center',
          padding: '0.95rem',
          borderRadius: 100,
          fontFamily: 'var(--font-sans)',
          fontSize: '0.9375rem',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          background: plan.ctaStyle === 'amber'
            ? 'linear-gradient(135deg, var(--amber-light), var(--amber-dark))'
            : 'transparent',
          color: plan.ctaStyle === 'amber' ? '#fff'
            : (plan.highlight ? '#fff' : 'var(--charcoal)'),
          border: plan.ctaStyle === 'amber'
            ? 'none'
            : `1.5px solid ${plan.highlight ? 'rgba(255,255,255,0.2)' : 'rgba(44,44,42,0.2)'}`,
          boxShadow: plan.ctaStyle === 'amber' ? 'var(--shadow-amber)' : 'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = plan.ctaStyle === 'amber'
            ? 'var(--shadow-amber-xl)'
            : `0 8px 24px rgba(${plan.highlight ? '255,255,255' : '44,44,42'},0.08)`
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none'
          e.currentTarget.style.boxShadow = plan.ctaStyle === 'amber' ? 'var(--shadow-amber)' : 'none'
        }}
      >
        {plan.cta} →
      </a>
    </motion.div>
  )
}

export default function PricingSection() {
  return (
    <section id="pricing" style={{ background: 'var(--cream)', padding: '8rem 0' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 1.5rem' }}>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '4.5rem' }}
        >
          <span className="eyebrow">Pricing</span>
          <h2 style={{ marginBottom: '0.75rem', marginTop: '0.5rem' }}>Simple, transparent pricing</h2>
          <p style={{ color: '#6a6a68' }}>No hidden fees. No "starting from" surprises. All prices include installation.</p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
          alignItems: 'center',
        }}>
          {plans.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} delay={i * 0.1} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{
            textAlign: 'center',
            marginTop: '2.5rem',
            fontSize: '0.8125rem',
            color: '#aaa',
          }}
        >
          GST applicable. EMI options available at 0% for 12 months.
        </motion.p>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #pricing > div > div:last-of-type {
            grid-template-columns: 1fr !important;
            max-width: 440px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  )
}

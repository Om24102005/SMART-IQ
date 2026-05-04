import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const testimonials = [
  {
    name: 'Rahul M.',
    city: 'Gurugram',
    initials: 'RM',
    savings: '₹6,400',
    savingsLabel: 'saved this year',
    quote: "I was skeptical but the numbers don't lie. My inverter app now matches exactly what SparshIQ shows.",
    accentColor: '#4A9FD5',
    bgGlow: 'rgba(27,79,114,0.15)',
    panels: 10,
    months: 8,
  },
  {
    name: 'Priya K.',
    city: 'Ahmedabad',
    initials: 'PK',
    savings: '₹4,200',
    savingsLabel: 'saved this year',
    quote: "Installed in 2 hours. Hasn't needed any attention since. My roof earns its keep now.",
    accentColor: 'var(--amber)',
    bgGlow: 'rgba(232,146,52,0.12)',
    panels: 8,
    months: 6,
  },
  {
    name: 'Aditya R.',
    city: 'Jaipur',
    initials: 'AR',
    savings: '₹8,100',
    savingsLabel: 'saved this year',
    quote: 'Jaipur dust is brutal. This thing runs every morning without fail. No maintenance, zero effort.',
    accentColor: '#4BC97A',
    bgGlow: 'rgba(45,122,63,0.14)',
    panels: 12,
    months: 11,
  },
]

function StarRating({ count = 5 }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="var(--amber)">
          <path d="M7 1.5l1.5 3 3.3.48-2.4 2.33.57 3.28L7 9.1l-2.97 1.56.57-3.28L2.2 4.98l3.3-.48L7 1.5z"/>
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({ t, delay }) {
  const ref    = useRef()
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.16,1,0.3,1] }}
      whileHover={{ y: -8, scale: 1.015 }}
      style={{
        background: '#fff',
        border: '1px solid rgba(44,44,42,0.07)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        boxShadow: '0 4px 24px rgba(44,44,42,0.08)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Accent top border */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${t.accentColor}, transparent)`,
        borderRadius: '24px 24px 0 0',
      }} />

      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <div style={{
          width: 52, height: 52,
          borderRadius: '50%',
          background: t.bgGlow,
          border: `2px solid ${t.accentColor}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-serif)',
          fontWeight: 700,
          fontSize: '1.05rem',
          color: t.accentColor,
          flexShrink: 0,
          boxShadow: `0 0 20px ${t.bgGlow}`,
        }}>
          {t.initials}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--charcoal)', lineHeight: 1.3 }}>
            {t.name}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: 2 }}>
            {t.city} · {t.panels} panels · {t.months} months
          </div>
        </div>
      </div>

      <StarRating />

      {/* Savings callout */}
      <div style={{
        background: t.bgGlow,
        border: `1px solid ${t.accentColor}25`,
        borderRadius: 14,
        padding: '1rem',
        display: 'flex',
        alignItems: 'baseline',
        gap: '0.5rem',
      }}>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: t.accentColor,
          lineHeight: 1,
        }}>
          {t.savings}
        </span>
        <span style={{ fontSize: '0.82rem', color: '#888' }}>{t.savingsLabel}</span>
      </div>

      {/* Quote */}
      <blockquote style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.9375rem',
        lineHeight: 1.7,
        color: '#5a5a58',
        borderLeft: `3px solid ${t.accentColor}`,
        paddingLeft: '0.875rem',
        margin: 0,
        fontStyle: 'italic',
        fontWeight: 350,
      }}>
        "{t.quote}"
      </blockquote>
    </motion.div>
  )
}

const PROOF_STATS = [
  { n: '2,000+', label: 'Installations across India' },
  { n: '4.9★',   label: 'Average customer rating' },
  { n: '₹2.4 Cr', label: 'Saved collectively' },
]

export default function TestimonialsSection() {
  const headerRef = useRef()
  const headerInView = useInView(headerRef, { once: true })

  return (
    <section style={{ background: 'var(--cream)', padding: '8rem 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 28 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '4.5rem' }}
        >
          <span className="eyebrow">Customer Stories</span>
          <h2 style={{ marginBottom: '0.875rem', marginTop: '0.5rem' }}>Real homes. Real results.</h2>
          <p style={{ maxWidth: '440px', margin: '0 auto', color: '#6a6a68' }}>
            From sceptics to advocates — actual customers with actual inverter data.
          </p>
        </motion.div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
        }}>
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} t={t} delay={i * 0.1} />
          ))}
        </div>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          style={{
            marginTop: '4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3rem',
            flexWrap: 'wrap',
            padding: '2rem',
            background: '#fff',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid rgba(44,44,42,0.06)',
          }}
        >
          {PROOF_STATS.map((item, i) => (
            <div key={item.n} style={{ textAlign: 'center', position: 'relative' }}>
              {i > 0 && (
                <div style={{
                  position: 'absolute', left: '-1.5rem', top: '50%',
                  transform: 'translateY(-50%)',
                  width: 1, height: 40,
                  background: 'rgba(44,44,42,0.1)',
                }} />
              )}
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'var(--charcoal)',
                lineHeight: 1,
              }}>
                {item.n}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#999', marginTop: 6 }}>{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #testimonials-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          #testimonials-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

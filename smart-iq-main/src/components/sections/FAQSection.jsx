import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const faqs = [
  {
    q: 'Will it damage my panels?',
    a: 'No. The EPDM foam strip uses less pressure than rainfall. Over 2,000 installations, we haven\'t had a single panel complaint. The strip is certified safe for monocrystalline, polycrystalline, and thin-film panels.',
  },
  {
    q: 'What if it rains during cleaning?',
    a: 'The system has a built-in rain sensor and checks weather forecasts 2 hours ahead. If it detects moisture or upcoming rain, it skips the cycle and rescheduled for the next morning automatically.',
  },
  {
    q: 'How long does installation take?',
    a: 'Two hours for a standard 8-panel setup. Our certified technicians handle everything — wiring, mounting, and app onboarding. You don\'t even need to be home.',
  },
  {
    q: 'Do I need to maintain it?',
    a: 'Just replace the foam strip once a year — it snaps in and out in 30 seconds. That\'s genuinely it. The system is designed to be fully autonomous.',
  },
  {
    q: 'What if I move houses?',
    a: 'The system uninstalls in 20 minutes and reinstalls on your new roof. Alternatively, we buy it back at 60% of purchase price — no questions asked.',
  },
  {
    q: 'Does it work on all roof types?',
    a: 'Yes — flat RCC rooftops, terracotta tiles, and metal sheet roofs. We do a free site audit before installation to confirm compatibility and optimal mounting.',
  },
]

function FAQItem({ faq, isOpen, onToggle, index }) {
  const ref    = useRef()
  const inView = useInView(ref, { once: true, margin: '-20px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07 }}
      style={{
        borderBottom: '1px solid rgba(44,44,42,0.09)',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          gap: '1.25rem',
          textAlign: 'left',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
          fontWeight: 500,
          color: isOpen ? 'var(--charcoal)' : '#444',
          lineHeight: 1.4,
          transition: 'color 0.25s',
        }}>
          {faq.q}
        </span>

        <motion.div
          animate={{
            rotate: isOpen ? 45 : 0,
            background: isOpen ? 'var(--amber)' : 'rgba(44,44,42,0.06)',
          }}
          transition={{ duration: 0.3, ease: [0.4,0,0.2,1] }}
          style={{
            width: 34, height: 34,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: isOpen ? '0 0 16px rgba(232,146,52,0.4)' : 'none',
            transition: 'box-shadow 0.3s ease',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <line x1="7" y1="2" x2="7" y2="12" stroke={isOpen ? '#fff' : '#444'} strokeWidth="1.6" strokeLinecap="round"/>
            <line x1="2" y1="7" x2="12" y2="7" stroke={isOpen ? '#fff' : '#444'} strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{   height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.4,0,0.2,1] }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{
              paddingBottom: '1.75rem',
              color: '#5a5a58',
              lineHeight: 1.75,
              fontSize: '1rem',
              maxWidth: '660px',
              paddingLeft: '0.1rem',
            }}>
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i)
  const headerRef  = useRef()
  const headerView = useInView(headerRef, { once: true })

  return (
    <section style={{ background: '#fff', padding: '8rem 0' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 1.5rem' }}>

        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 28 }}
          animate={headerView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span className="eyebrow">FAQ</span>
          <h2 style={{ marginBottom: '0.875rem', marginTop: '0.5rem' }}>Questions worth asking</h2>
          <p style={{ color: '#6a6a68' }}>If you're wondering about it, someone else already did too.</p>
        </motion.div>

        <div>
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{
            marginTop: '4rem',
            textAlign: 'center',
            padding: '2.75rem 2rem',
            background: 'var(--cream)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(232,146,52,0.12)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle top gradient */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, var(--amber), transparent)',
            opacity: 0.5,
          }} />

          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.45rem',
            fontWeight: 600,
            marginBottom: '0.6rem',
          }}>
            Still have a question?
          </h3>
          <p style={{ marginBottom: '1.75rem', fontSize: '0.9375rem', color: '#6a6a68' }}>
            Our team responds within 2 hours on weekdays.
          </p>
          <a
            href="mailto:hello@sparshiq.com"
            className="btn-amber"
            style={{ display: 'inline-flex' }}
          >
            Write to us
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 4 }}>
              <path d="M2 4l6 5 6-5M2 4h12v9H2V4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

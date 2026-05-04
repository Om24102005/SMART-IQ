import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 1.5,
      staggerChildren: 0.18,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] },
  },
}

export default function HeroContent() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          padding: '0 2rem 5rem',
          maxWidth: '680px',
          pointerEvents: 'auto',
        }}
      >
        {/* Eyebrow */}
        <motion.span
          variants={item}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8125rem',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--amber)',
            display: 'block',
            marginBottom: '1rem',
          }}
        >
          Automated Solar Panel Cleaning
        </motion.span>

        {/* H1 */}
        <motion.h1
          variants={item}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            marginBottom: '1.25rem',
          }}
        >
          Your panels are losing money every day.
        </motion.h1>

        {/* Subhead */}
        <motion.p
          variants={item}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1rem, 1.8vw, 1.1875rem)',
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.72)',
            maxWidth: '520px',
            marginBottom: '2rem',
          }}
        >
          SparshIQ cleans them automatically. So you actually get what you paid for.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.875rem',
          }}
        >
          <a
            href="#calculator"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 1.75rem',
              background: 'var(--amber)',
              color: '#fff',
              borderRadius: '100px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9375rem',
              fontWeight: 500,
              boxShadow: '0 8px 32px rgba(232,146,52,0.35)',
              transition: 'transform 0.2s ease, background 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.background = '#C97820'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.background = 'var(--amber)'
            }}
          >
            See it on your roof
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <a
            href="#problem"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 1.75rem',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1.5px solid rgba(255,255,255,0.3)',
              borderRadius: '100px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9375rem',
              fontWeight: 500,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              transition: 'background 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            How much you're losing
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.6875rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            writingMode: 'vertical-rl',
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.3)' }}
        />
      </motion.div>
    </div>
  )
}
